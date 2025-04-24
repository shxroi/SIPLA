import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sipla_db',
    password: 'postgres', // Sesuaikan dengan password PostgreSQL Anda
    port: 5432,
});

export default pool; 