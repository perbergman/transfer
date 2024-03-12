const { BlobServiceClient } = require("@azure/storage-blob");
const crypto = require("crypto");
const AZURE_STORAGE_CONNECTION_STRING = process.env["AzureWebJobsStorage"];
const containerName = "uploads";

const parseMultipartFormData =
  require("@anzp/azure-function-multipart").default;

module.exports = async function (context, req) {
  context.log(
    "JavaScript HTTP trigger function processed a request for file upload."
  );

  if (req.method !== "POST") {
    context.res = { status: 405, body: "Only POST requests are allowed." };
    return;
  }
  const contentType = req.headers["content-type"];
  if (!contentType.includes("multipart/form-data")) {
    context.res = { status: 400, body: "Not a multipart/form-data request" };
    return;
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const { fields, files } = await parseMultipartFormData(req);
  context.log("files " + files);
  const file = files[0];

  let root = {};
  fields.forEach((field) => {
    context.log(`Got field: ${field.name} = ${field.value}`);
    addPropertyToObject(root, field.name, field.value);
  });
  
  const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
  const bodyBuffer = Buffer.from(file.bufferFile);
  await blockBlobClient.upload(bodyBuffer, bodyBuffer.length);
  await blockBlobClient.setMetadata(root);
  
  console.log("hash", await calcHash(bodyBuffer));
  await getProperties(blockBlobClient);

  const responseMessage = {
    fields,
    files,
  };
  
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

function addPropertyToObject(obj, key, value) {
  obj[key] = value;
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

async function calcFileHash(filename) {
  const content = fs.readFileSync(filename, "utf8");
  checkHash(content);
};

async function calcHash(buffer) {
  const hash = crypto.createHash("md5");
  hash.update(buffer);
  return hash.digest("base64");
};