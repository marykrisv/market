import express from 'express'
import { addRow } from '../crud.js'
import pool from '../db.js'

const router = express.Router()

const tableName = 'inventory'

router.get('/', (req, res) => {
    const {productid} = req.query

    getInventoryByProductId(productid).then(result => res.json(result))
})

router.post('/', (req, res) => {
    const {productid, transaction, quantity, details} = req.body

    const inventory = [productid, transaction, quantity, details]

    addRow(tableName, inventory).then(result => 
        result ? 
            res.status(201).send(`Inventory successfully added!`)
            :
            res.status(409).send('Inventory not added!')
    )
})

const getInventoryByProductId = async (prodId) => {
    try {
        const result = await pool.query(`SELECT * from inventory 
            WHERE productid = ${prodId}`
        )

        return result.rows
    } catch (err) {
        console.error(err.message)
    }
}

export default router