const {db} = require("../common/connectors");
const rates = new Map([['USD', 1.0], ['MDL', 17.69]]);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let response;

    const ents = new Map();
    (await getEntities()).map(e => ents.set(e.address, e.name));
    ents.set("0xaA39E1A9F140f9dAdFC26754F44EBc01a37bda7B", "ADMIN");
    ents.set("0xaE985c4a0acDc101e0D440E75D60f69583012fdD", "COMMON");
    console.log(ents);

    const currs = new Map();
    (await getContractCurrencies()).map(e => currs.set(e.contract_address, e.currency));

    const logs = await getLogs();
    //console.log(logs);
    const wallets = new Map();
    let counter = 0;

    logs.forEach((item) => {
        const data = item.data;
        data.forEach((v) => {
            if (v.type === 'address' && !wallets.has(v.value)) {
                console.log(v, ents.get(v.value));
                wallets.set(v.value, ents.get(v.value) || "wallet#" + counter++);
            }
        });
    });

    console.log(wallets);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response
    };
}

async function getLogs() {
    const pgClient = await db();
    let response;

    try {
        await pgClient.connect();
        const result = await pgClient.query("select log.decoded -> 'data' as data, split_part(instance, '/', 2) as currency from log join transaction on log.id = transaction.id where log.decoded ->'event'->>'name' != 'Transfer'");
        response = result.rows;
    } catch (e) {
        console.error(e);
    }  finally {
        await pgClient.end();
    }
    return response;
}

async function getEntities() {
    const pgClient = await db();
    let response;

    try {
        await pgClient.connect();
        const result = await pgClient.query("select wallet.address, entity.name from wallet join entity on wallet.id = entity.wallet_id");
        response = result.rows;
    } catch (e) {
        console.error(e);
    }  finally {
        await pgClient.end();
    }
    return response;
}

function getRate(currency) {
    return rates.get(currency);
}

async function getContractCurrencies() {
    const pgClient = await db();
    let response;

    try {
        await pgClient.connect();
        const result = await pgClient.query("select contract_address, split_part(key, '/', 2) as currency from instance");
        response = result.rows;
    } catch (e) {
        console.error(e);
    }  finally {
        await pgClient.end();
    }
    return response;
}