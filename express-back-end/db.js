import PG from 'pg'

const Pool = PG.Pool

// AWS DB
const db = {
    user: 'postgres',
    password: 'admin123',
    database: 'market_db',
    host: 'market-db.cfsxy9eyo0nn.us-east-2.rds.amazonaws.com',
    port: 5432
}

// local Docker
// const db = {
//     database: 'market_db',
//     host: 'localhost',
//     port: 5432
// }

const pool = new Pool(db)

export default pool