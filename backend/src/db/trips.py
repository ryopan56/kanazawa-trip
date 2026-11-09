async def get_trips(db, user_id):
    result = (
        await db.prepare("""
        SELECT T.id, T.name, T.start_date, T.end_date
        FROM trips AS T
        INNER JOIN trip_users AS TU
        ON T.id = TU.trip_id
        WHERE TU.user_id = ?
        ORDER BY T.start_date, T.id
        """)
        .bind(user_id)
        .run()
    )

    return result.results


async def create_trip(db, name, start_date, end_date, user_id):
    result = await db.batch(
        [
            db.prepare("""
            INSERT INTO trips (name, start_date, end_date) Values(?, ?, ?)
            RETURNING id, name, start_date, end_date
            """).bind(name, start_date, end_date),
            db.prepare("""
            INSERT INTO trip_users(user_id, trip_id, role)
            Values(?, last_insert_rowid(), 'owner')
            """).bind(user_id),
        ]
    )

    return result[0].results[0]


async def update_trip(db, tid, updates, user_id):
    columns = {"name", "start_date", "end_date"}

    # 埋め込むSQLのリスト
    set_sql_parts = []

    # placeholderにbindする値のリスト
    values = []

    # 受け取ったupdateのうちcolumnsにない（想定外の）値を排除し各リストに追加
    for key, value in updates.items():
        if key not in columns:
            continue

        set_sql_parts.append(f"{key} = ?")
        values.append(value)

    values.extend([tid, user_id])

    sql = f"""
        UPDATE trips
        SET {", ".join(set_sql_parts)}
        WHERE id = ? AND EXISTS (
        SELECT 1
        FROM trip_users
        WHERE trip_users.user_id = ?
        AND trip_users.trip_id = trips.id)
        RETURNING id, name, start_date, end_date
        """

    result = await db.prepare(sql).bind(*values).run()

    # idカラムに対応する値がない場合にNoneを返す
    # 権限がない場合もNoneを返す
    # name, start_date, end_date については対応する値がないことは想定されない
    if not result.results:
        return None

    return result.results[0]


async def delete_trip(db, tid, user_id):
    result = (
        await db.prepare("""
  DELETE FROM trips
  WHERE id = ? AND EXISTS (
  SELECT 1
  FROM trip_users
  WHERE trip_users.user_id = ?
  AND trip_users.trip_id = trips.id
  AND trip_users.role = ?)
  RETURNING id
  """)
        .bind(tid, user_id, "owner")
        .run()
    )

    return bool(result.results)
