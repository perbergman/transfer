const pg = require('pg');
const Pool = require('pg-pool');
const url = require('url')

async function db() {
    const conn = process.env['DB'];
    return new pg.Client(conn);
}

/*
 idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
 */

async function dbPool() {
    const params = url.parse(process.env['DB']);
    const auth = params.auth.split(':');
    const config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: false
    };
    return new Pool(config);
}

async function query(pool, sql) {
    let response;
    var client = await pool.connect();
    try {
        const result = await client.query(sql);
        response = result.rows;
    } catch (e) {
        console.error(e);
    } finally {
        await client.release();
    }
    return response;
}

module.exports = {
    db: db,
    dbPool: dbPool,
    query: query
}