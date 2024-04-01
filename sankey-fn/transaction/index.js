const {db, pool, dbPool} = require("../common/connectors");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const pool = await dbPool();

    var txid = context.bindingData.txid;
    if (!txid) {
        console.log("all blocks ");
        context.res = {
            status: 404,
            body: "no arg"
        };
        return;
    }

    const block = await query(pool,  `SELECT * from blk.block where '"${txid}"'::jsonb <@ (payload-> 'transactions')::jsonb`);
    const ret = block;
    const id = block[0].payload.number;
    const txs = await query(pool, `SELECT *
                             FROM blk.transaction
                             WHERE transaction.id = ANY (SELECT jsonb_array_elements_text(payload -> 'transactions')
                                                         FROM blk.block
                                                         WHERE payload ->> 'number' = '${id}')`)

    await Promise.all(txs.map(async tx => {
        ret.push([tx, await query(pool, `SELECT *
                                   FROM blk.log
                                   WHERE log.id = ANY (SELECT id FROM blk.transaction WHERE id = '${tx.id}')`)]);
    }));

    pool.end();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: ret
    };
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
