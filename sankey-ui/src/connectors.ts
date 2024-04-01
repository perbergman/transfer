
export function db() {
    const conn: any = process.env.DB;
    const pg = require('pg');
    return new pg.client(conn);
}


