async def get_activities(db, tid: int, user_id: int):
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

    if not result.results:
        return None

    activity_list = (
        await db.prepare("""
        SELECT A.id,
          A.trip_id,
          A.place_id,
          A.name,
          A.category,
          A.start_datetime,
          A.end_datetime,
          A.memo
        FROM activities AS A
        WHERE A.trip_id = ?
        AND EXISTS (
        SELECT 1
        FROM trip_users AS TU
        WHERE TU.user_id = ?
        AND TU.trip_id = A.trip_id)
        ORDER BY A.start_datetime, A.id
        """)
        .bind(tid, user_id)
        .run()
    )
    return activity_list.results
