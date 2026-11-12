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
