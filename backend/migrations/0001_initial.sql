-- Migration number: 0001 	 2026-10-09T13:01:15.153Z
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (start_date <= end_date)
);

CREATE TABLE trip_users (
    user_id INTEGER NOT NULL,
    trip_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'editor')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, trip_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE places (
    id INTEGER PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    latitude REAL,
    longitude REAL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    place_id INTEGER,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    start_datetime TEXT NOT NULL,
    end_datetime TEXT,
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE RESTRICT,
    CHECK (end_datetime IS NULL OR start_datetime <= end_datetime)
);

CREATE TABLE expenses (
    id INTEGER PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    amount INTEGER NOT NULL CHECK (amount >= 1),
    category TEXT NOT NULL,
    expense_date TEXT NOT NULL,
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
