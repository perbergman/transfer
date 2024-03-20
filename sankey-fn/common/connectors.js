const pg = require('pg');

async function db() {
    const conn = process.env['DB'];
    return new pg.Client(conn);
}

module.exports = {
    db: db
}