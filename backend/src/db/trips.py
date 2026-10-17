async def get_trips(db):
  result = await db.prepare("""
    SELECT id, name, start_date, end_date
    FROM trips
    ORDER BY start_date, id"""
  ).run()

  return result.results

async def create_trip(db, name, start_date, end_date):
  result = await db.prepare(
    """
    INSERT INTO trips (name, start_date, end_date) Values(?, ?, ?)
    RETURNING id, name, start_date, end_date
    """
  ).bind(name, start_date, end_date).run()

  return result.results[0]

async def update_trip(db, tid, updates):
  columns = {
    "name",
    "start_date",
    "end_date"

  }

  # 埋め込むSQLのリスト
  set_sql_parts = []

  # placeholderにbindする値のリスト
  values = []

  # 受け取ったupdateのうちcolumnsにない（想定外の）値を排除し各リストに追加, やや過剰か
  for key, value in updates.items():
    if key not in columns:
      continue

    set_sql_parts.append(f"{key} = ?")
    values.append(value)

  values.append(tid)

  sql = f"""
  UPDATE trips
  SET {", ".join(set_sql_parts)}
  WHERE id = ?
  RETURNING id, name, start_date, end_date
  """

  result = await db.prepare(sql).bind(*values).run()

  # idカラムに対応する値がない場合にNoneを返す
  # name, start_date, end_date については対応する値がないことは想定されない
  if not result.results:
    return None

  return result.results[0]

async def delete_trip(db, tid):
  result = await db.prepare("""
  DELETE FROM trips
  WHERE id = ?
  RETURNING id
  """
  ).bind(tid).run()

  return bool(result.results)

