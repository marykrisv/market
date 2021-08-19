import express from 'express'
import { addRow, deleteRow, getAll, getRow, updateRow } from '../crud.js'
import pool from '../db.js'

const router = express.Router()

const tableName = 'products'

router.get('/withinventory', (req, res) => {
    getAllInventory().then(result => res.json(result))
})

router.get('/:id/withinventory', (req, res) => {
    const id = req.params.id

    getInventoryByProductId(id).then(result => res.json(result))
})

router.get('/', (req, res) => {
    getAll(tableName).then(result => res.json(result))
})

router.post('/', (req, res) => {
    const {name, description, category, disabled} = req.body

    const product = [name, description, category, disabled]

    addRow(tableName, product).then(result => 
        result ? 
            res.status(201).send(`Product ${name} successfully added!`)
            :
            res.status(409).send('Product not added!')
    )
})

router.put('/:id', (req, res) => {
    const id = req.params.id

    const {name, description, category, disabled} = req.body

    const product = [id, name, description, category, disabled]

    updateRow(tableName, product).then(result => 
        result ? 
            res.status(200).send('Product successfully updated!')
            :
            res.status(404).send('Product not updated!')
    )
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    deleteRow(tableName, id).then(result => 
        result ? 
            res.status(200).send('Product successfully deleted!')
            :
            res.status(404).send('Product not deleted!')
    )
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    getRow(tableName, id).then(result => res.json(result))
})

const getAllInventory = async () => {
    try {
        const result = await pool.query(`SELECT p.*, sum(i.quantity) as total from products p
            left join inventory i on p.id = i.productId
            group by p.id`
        )

        return result.rows
    } catch (err) {
        console.error(err.message)
    }
}

const getInventoryByProductId = async (id) => {
    try {
        const result = await pool.query(`SELECT p.*, sum(i.quantity) as total from products p
            left join inventory i on p.id = i.productId 
            WHERE p.id = ${id}
            group by p.id`
        )

        if (result.rowCount !== 0) return result.rows[0]

        return null
    } catch (err) {
        console.error(err.message)
    }
}

export default router