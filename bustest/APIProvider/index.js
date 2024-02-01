const { ServiceBusClient } = require("@azure/service-bus");

module.exports = async function(context, myQueueItem) {
    const correlationId = context.bindingData.messageId;
    context.log('APIProvider queue trigger function processed session', correlationId);
    const serviceBusConnectionString = process.env["moekkel667_SERVICEBUS"];
    const replyQueue = "reply-queue";

    const client = new ServiceBusClient(serviceBusConnectionString);
    const sender = client.createSender(replyQueue);

    // Process the request
    const processedResult = processMessage(myQueueItem);

    // Send a response to the reply queue with the same correlation ID
    console.log("APIProvider - " + JSON.stringify(context));
    await sender.sendMessages({
        body: processedResult,
        correlationId: context.bindingData.correlationId,
    });
    console.log("APIProvider Send sent");
    client.close();
};

function processMessage(messageBody) {
    // Process the message and return a response
    return `APIProvider Processed: ${messageBody}`;
}
