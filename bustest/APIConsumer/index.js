const { ServiceBusClient, delay } = require("@azure/service-bus");
const crypto = require("crypto");

module.exports = async function (context, req) {
  context.log(
    "APIConsumer HTTP trigger function processed a request." +
      JSON.stringify(req)
  );

  const serviceBusConnectionString = process.env["moekkel667_SERVICEBUS"];
  const requestQueue = "request-queue";
  const replyQueue = "reply-queue";

  const client = new ServiceBusClient(serviceBusConnectionString);
  const sender = client.createSender(requestQueue, {
    receiveMode: "receiveAndDelete",
  });

  const correlationId = crypto.randomUUID();
  console.log(`APIConsumer - Correlation ID: ${correlationId}`);

  var response = '';
  const processMessage = async (message) => {
    console.log(
      `APIConsumer - Received: ${message} - ${message.body} `
    );
    if(message.correlationId == correlationId) {
      console.log("correlationId: " + correlationId);
      console.log(`APIConsumer - correlation ID: ${message.correlationId}`);
      response = message.body;
      console.log(`APIConsumer - Response: ${response}`);
    } else {
      console.log(`APIConsumer - Wrong correlation ID:${correlationId} ${message.correlationId}`);
    }
  };

  const processError = async (args) => {
    console.log(
      `>>>>> Error from error source ${args.errorSource} occurred: `,
      args.error
    );
    reject(args.error);
  };

  // Send a message to the request queue with the correlation ID
  try {
    await sender.sendMessages({
      body: "bullen " + correlationId, // or any message content
      replyTo: replyQueue,
      correlationId: correlationId,
    });
  } catch (err) {
    console.log("APIConsumer - Error sending message:", err);
    client.close();
  }

  client.createReceiver(replyQueue, {
    receiveMode: "receiveAndDelete",
  }).subscribe({ processMessage, processError });

//  const response = await receiveMessages(receiver, correlationId, replyQueue).then((response) => {
//    console.log(`APIConsumer - Response: ${response}`);
//    return response;
//  });
  
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: response || "APIConsumer No response in time",
  };
};

async function receiveMessages(receiver) {
  // If receiving from a subscription you can use the acceptSession(topic, subscription, sessionId) overload
  let endDate;

  while (true) {
    const subscribePromise = new Promise((resolve, reject) => {
      const processMessage = async (message) => {
        console.log(
          `APIConsumer - Received: ${message.correlationId} - ${message.body} `
        );
        response = message.body;
        console.log(`APIConsumer - Response: ${response}`);
        resolve(response);
      };
      const processError = async (args) => {
        console.log(
          `>>>>> Error from error source ${args.errorSource} occurred: `,
          args.error
        );
        reject(args.error);
      };

      receiver.subscribe({
        processMessage,
        processError,
      });
    });

    const now = Date.now();
    if (endDate == null) {
      endDate = now + 1000;
    }
    let remainingTime = endDate - now;
    //console.log(`Waiting for ${remainingTime} milliseconds for messages to arrive.`);

    try {
      await Promise.race([subscribePromise]);//, delay(remainingTime)]);
      // wait time has expired, we can stop listening.
      console.log(
        `Time has expired, closing receiver for session '${sessionId}'`
      );

      await receiver.close();
      break;
    } catch (err) {
      // `err` was already logged part of `processError` above.
      await receiver.close();
    }
  }

  return response;
}
