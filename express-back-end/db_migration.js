import pool from './db.js'

const createUserTable = async () => {
    try {
        await pool.query(
            `
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    first_name VARCHAR(255),
                    last_name VARCHAR(255),
                    role VARCHAR(20),
                    username VARCHAR(255),
                    password VARCHAR(255),
                    disabled BOOLEAN default false,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `
        )
    } catch (err) {
        console.error(err.message)
    }
}

const createProductTable = async () => {
    try {
        await pool.query(
            `
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    description VARCHAR(255),
                    category VARCHAR(20),
                    disabled BOOLEAN default false,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `
        ).then(() => {
            seedUsers()
        })
    } catch (err) {
        console.error(err.message)
    }
}

const createInventoryTable = async () => {
    try {
        await pool.query(
            `
                CREATE TABLE IF NOT EXISTS inventory (
                    id SERIAL PRIMARY KEY,
                    productId INTEGER,
                    transaction VARCHAR(255),
                    quantity INTEGER,
                    details VARCHAR(255),
                    created_by INTEGER,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `
        )
    } catch (err) {
        console.error(err.message)
    }
}

const createTables = () => {
    createProductTable()
    createUserTable()
    createInventoryTable()
}

const seedUsers = async () => {
    try {
        await pool.query(
            `
                INSERT INTO USERS (id, first_name, last_name, role, username, password) 
                VALUES 
                (999999, 'Andy', 'Admin', 'ADMIN', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
                (1000000, 'Steffy', 'Staff', 'STAFF', 'staff', '10176e7b7b24d317acfcf8d2064cfd2f24e154f7b5a96603077d5ef813d6a6b6') 
                ON CONFLICT (id) DO NOTHING
            `
        )
    } catch (err) {
        console.error(err.message)
    }
}

export default createTables