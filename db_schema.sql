PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Table for personal information

CREATE TABLE IF NOT EXISTS personal_information (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    d_o_b DATE NOT NULL,
    sex TEXT CHECK(sex IN ('Male', 'Female')),
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_name TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    last_login DATETIME
);

-- Table for logging in with email and password
CREATE TABLE IF NOT EXISTS login_credentials (
    login_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    FOREIGN KEY (email) REFERENCES personal_information(email) ON DELETE CASCADE
    FOREIGN KEY (user_name) REFERENCES personal_information(user_name) ON DELETE CASCADE
);

-- Table to store medical records
CREATE TABLE IF NOT EXISTS med_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL,
    doctor TEXT NOT NULL,
    FOREIGN KEY (user) REFERENCES personal_information(email) ON DELETE CASCADE
);

-- Insert example personal information
INSERT INTO personal_information ('first_name', 'last_name', 'd_o_b', 'sex', 'mobile_number', 'email', 'user_name', 'address', 'unit_number', 'postal_code', 'country', 'last_login') VALUES ('Yong Hua', 'Lee', '1999-03-23', 'Female', '81234567', 'test@gmail.com', 'YH99', 'Homeless', '01-001', '889900', 'Singapore', '2024-08-01 20:00:00');

-- Insert password for example
-- Password is 1234
INSERT INTO login_credentials ('email', 'user_name', 'password') VALUES ((SELECT email from personal_information WHERE email = 'test@gmail.com'), 'YH99', '$2b$10$Jasv0mDO7PRy.UKSdsf6FuEyZe/mOdP7ThTFn28C3kS0L9EJLscD.');

-- Insert example record for test@gmail.com
INSERT INTO med_records ('user', 'date', 'type', 'doctor') VALUES ((SELECT email FROM personal_information WHERE email = 'test@gmail.com'), '2023-12-31', 'Blood Test', 'Dr. Lee');
INSERT INTO med_records ('user', 'date', 'type', 'doctor') VALUES ((SELECT email FROM personal_information WHERE email = 'test@gmail.com'), '2024-03-01', 'Blood Test', 'Dr. Lim');

COMMIT;