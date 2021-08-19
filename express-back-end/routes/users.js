import express from 'express'
import sjcl from 'sjcl'
import { addRow, deleteRow, getAll, getRow, updateRow } from '../crud.js'
import pool from '../db.js'

const router = express.Router()

const tableName = 'users'

router.get('/', (req, res) => {
    getAll(tableName).then(result => res.json(result))
})

router.post('/', (req, res) => {
    const {first_name, last_name, role, username, password, disabled} = req.body

    const user = [first_name, last_name, role, username, disabled, encryptPassword(password)]

    addRow(tableName, user).then(result => 
        result ? 
            res.status(201).send(`User ${first_name} successfully added!`)
            :
            res.status(409).send('User not added!')
    )
})

router.put('/:id', (req, res) => {
    const id = req.params.id

    const {first_name, last_name, role, username, password, disabled} = req.body

    const user = [id, first_name, last_name, role, username, disabled, encryptPassword(password)]

    updateRow(tableName, user).then(result => 
        result ? 
            res.status(200).send('User successfully updated!')
            :
            res.status(404).send('User not updated!')
    )
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    deleteRow(tableName, id).then(result => 
        result ? 
            res.status(200).send('User successfully deleted!')
            :
            res.status(404).send('User not deleted!')
    )
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    getRow(tableName, id).then(result => res.json(result))
})

router.post('/login', (req, res) => {
    const {username, password} = req.body

    signIn(username, password).then(result => res.json(result))
})

const signIn = async (username, password) => {
    try {
        const result = await pool.query(
                `SELECT * FROM users 
                WHERE username=$1 AND password=$2`, [username, encryptPassword(password)]
            )

        if (result.rowCount !== 0) return result.rows[0]

        return null
    } catch (err) {
        console.error(err.message)
    }
}

const encryptPassword = (password) => {
    const myBitArray = sjcl.hash.sha256.hash(password)
    return sjcl.codec.hex.fromBits(myBitArray)
}

export default router