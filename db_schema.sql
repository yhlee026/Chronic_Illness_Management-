PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS personal_information (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    d_o_b DATE NOT NULL,
    sex TEXT CHECK(sex IN ('Male', 'Female')),
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS login_credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    FOREIGN KEY (email) REFERENCES personal_information(email) ON DELETE CASCADE
);

COMMIT;