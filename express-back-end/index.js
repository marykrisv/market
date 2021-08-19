import express from 'express'
import createTables from './db_migration.js'
import cors from 'cors'

import usersRoutes from './routes/users.js'
import productsRoutes from './routes/products.js'
import inventoryRoutes from './routes/inventory.js'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(cors())

app.use('/api/users', usersRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/inventory', inventoryRoutes)

app.listen(PORT, () => {
    createTables()
    console.info(`Server running on port ${PORT}...`)
})