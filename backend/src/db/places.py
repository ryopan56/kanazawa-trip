async def get_places(db, tid, user_id):
    result = (
        await db.prepare("""
        SELECT 1
        FROM trip_users
        WHERE trip_users.trip_id = ?
        AND trip_users.user_id = ?
        """)
        .bind(tid, user_id)
        .run()
    )

    # ユーザにアクセス権限のあるtripがない場合
    if not result.results:
        return None

    # 一つ目のSQL実行後に権限削除された場合に
    # 権限のないユーザに場所一覧を返さないようにするため
    # もう一度trip_usersを検索する
    place_list = (
        await db.prepare("""
        SELECT P.id, P.trip_id, P.name, P.address, P.latitude, P.longitude
        FROM places AS P
        WHERE P.trip_id = ? AND EXISTS(
        SELECT 1
        FROM trip_users AS TU
        WHERE TU.user_id = ?
        AND TU.trip_id = P.trip_id)
        ORDER BY P.id
        """)
        .bind(tid, user_id)
        .run()
    )
    return place_list.results


async def create_place(db, tid, user_id, name, address):
    result = (
        await db.prepare("""
        INSERT INTO places (trip_id, name, address)
        SELECT ?, ?, ?
        WHERE EXISTS (
        SELECT 1
        FROM trip_users
        WHERE trip_users.trip_id = ?
        AND trip_users.user_id = ?)
        RETURNING id, trip_id, name, address, latitude, longitude
        """)
        .bind(tid, name, address, tid, user_id)
        .run()
    )
    if not result.results:
        return None

    return result.results[0]


# こちらの書き方でも実質同じにはなる。しかし、
# SELECT FROM して抽出した結果が複数存在する場合はその数だけINSERTされる。
# 今回はtrip_users.trip_id と trip_users.user_id の組み合わせが一意なので
# 上のコードと同じにはなるが、こちらの意図とは異なるクエリなので不採用。
# result = (
#     await db.prepare("""
#         INSERT INTO places (trip_id, name, address)
#         SELECT trip_users.trip_id, ?, ?
#         FROM trip_users
#         WHERE trip_users.trip_id = ?
#         AND trip_users.user_id = ?
#         RETURNING id, trip_id, name, address, latitude, longitude
#         """)
#     .bind(name, address, tid, user_id)
#     .run()
# )
