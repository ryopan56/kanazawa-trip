async def get_user_by_email(db, email):
    result = (
        await db.prepare("""
        SELECT id, password_hash FROM users WHERE email = ?
        """)
        .bind(email)
        .run()
    )
    if not result.results:
        return None

    return result.results[0]
