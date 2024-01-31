const {BlobServiceClient} = require("@azure/storage-blob");
const crypto = require("crypto");
const Busboy = require("busboy");

const AZURE_STORAGE_CONNECTION_STRING = process.env["AzureWebJobsStorage"];
const containerName = "uploads";

module.exports = async function (context, req) {
    context.log(
        "JavaScript HTTP trigger function processed a request for file upload."
    );

    if (req.method !== "POST") {
        context.res = {status: 405, body: "Only POST requests are allowed."};
        return;
    }

    const contentType = req.headers["content-type"];
    if (!contentType.includes("multipart/form-data")) {
        context.res = {status: 400, body: "Not a multipart/form-data request"};
        return;
    }

    const busboy = Busboy({headers: req.headers});

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    let blobName = '';
    let map = new Map();
    let bodyBuffer = Buffer.from('');

    busboy.on("file", function (fieldname, file, meta) {
        file.on("data", function (data) {
            bodyBuffer = Buffer.from(data);
            console.log(
                `File [${fieldname}]: filename: '${meta.filename}', got ${data.length} bytes`
            );
            blobName = "/opt/supplier/" + meta.filename;
        }).on('close', () => {
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            calcHash(bodyBuffer);
            uploadBlobResponse = blockBlobClient.upload(
                bodyBuffer,
                bodyBuffer.length
            ).then(() => {
                console.log('File [' + fieldname + '] Finished');
                console.log(blobName);
                console.log(map);

                let root = {}
                map.forEach(async (value, key) => {
                    console.log(key + " = " + value);
                    try {
                        addPropertyToObject(root, key, value);
                    } catch (error) {
                        console.log(error);
                    }
                });
                console.log(root);
                const clt = containerClient.getBlockBlobClient(blobName);
                clt.setMetadata(root).then(() => console.log("done"));
                console.log(
                    `Upload block blob ${blobName} successfully ${uploadBlobResponse}`
                );
            });
            getProperties(containerClient.getBlockBlobClient(blobName));
        });
    });

    busboy.on(
        "field",
        function (
            fieldname,
            val,
            fieldnameTruncated,
            valTruncated,
            encoding,
            mimetype
        ) {
            console.log(`Field [${fieldname}]: value: ${val}`);
            map.set(fieldname, val);
        }
    );

    busboy.write(req.body, function () {
    });

    context.res = {
        status: 200,
        body: {result: "done"},
    };

};

async function getProperties(blobClient) {
    const properties = await blobClient.getProperties();
    console.log(blobClient.name + " properties: ");

    for (const property in properties) {
        if (property === "contentMD5") {
            console.log(`    contentMD5: ${properties[property].toString("base64")}`); // this is a base64 string
        }
        switch (property) {
            // nested properties are stringified and returned as strings
            case "metadata":
            case "objectReplicationRules":
                console.log(`    ${property}: ${JSON.stringify(properties[property])}`);
                break;
            default:
                console.log(`    ${property}: ${properties[property]}`);
                break;
        }
    }
}

function addPropertyToObject(obj, key, value) {
    obj[key] = value;
}

async function calcFileHash(filename) {
    const content = fs.readFileSync(filename, "utf8");
    checkHash(content);
}

async function calcHash(buffer) {
    const hash = crypto.createHash("md5");
    hash.update(buffer);
    const sha256Hash = hash.digest("base64");
    console.log("Hash " + sha256Hash);
}
