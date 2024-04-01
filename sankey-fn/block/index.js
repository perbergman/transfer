const {db, pool, dbPool, query} = require("../common/connectors");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const pool = await dbPool();

    var start = context.bindingData.start;
    var end = context.bindingData.end;
    let blocks;

    if (!start || !end) {
        console.log("all blocks ");
        blocks = await query(pool, "select * from blk.block");
    } else {
        blocks = await query(pool, `select *
                                          from blk.block
                                          where created >= '${start} 00:00:00-00'::timestamptz
                                            and created <= '${end} 00:00:00-00'::timestamptz + '1 day'`);
    }
    pool.end();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: blocks
    };
}


