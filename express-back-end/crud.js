import pool from './db.js'

const tableInfo = {
    users: {
        addRows: ['first_name', 'last_name', 'role', 'username', 'disabled', 'password'],
        updateRows: ['first_name=$2', 'last_name=$3', 'role=$4', 'username=$5', 'disabled=$6', 'password=$7']
    },
    products: {
        addRows: ['name', 'description', 'category', 'disabled'],
        updateRows: ['name=$2', 'description=$3', 'category=$4', 'disabled=$5']
    },
    inventory: {
        addRows: ['productid', 'transaction', 'quantity', 'details']
    }
}

export const getAll = async (tableName) => {
    try {
        const result = await pool.query(`SELECT * FROM ${tableName}`)

        return result.rows
    } catch (err) {
        console.error(err.message)
    }
}

export const addRow = async (tableName, data) => {
    const tableRowsName = tableInfo[tableName].addRows

    var i = 1
    const valueRowsParam = tableRowsName.map(() => `$${i++}`)

    try {
        const result = await pool.query(
                `INSERT INTO ${tableName} 
                (${tableRowsName.join(',')}) 
                VALUES (${valueRowsParam.join(',')})`, data
            )

        return result.rowCount !== 0
    } catch (err) {
        console.error(err.message)
    }
}

export const updateRow = async (tableName, data) => {
    try {
        const result = await pool.query(
                `UPDATE ${tableName} SET 
                ${tableInfo[tableName].updateRows.join(',')} 
                WHERE id=$1`, data
            )

        return result.rowCount !== 0
    } catch (err) {
        console.error(err.message)
    }
}

export const deleteRow = async (tableName, id) => {
    try {
        const result = await pool.query(
                `DELETE FROM ${tableName} 
                WHERE id=${id}`
            )

        return result.rowCount !== 0
    } catch (err) {
        console.error(err.message)
    }
}

export const getRow = async (tableName, id) => {
    try {
        const result = await pool.query(
                `SELECT * FROM ${tableName} 
                WHERE id=${id}`
            )

        if (result.rowCount !== 0) return result.rows[0]

        return null
    } catch (err) {
        console.error(err.message)
    }
}