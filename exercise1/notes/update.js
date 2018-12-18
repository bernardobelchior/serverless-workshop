"use strict";

const dynamodb = require("../interfaces/dynamodb");

module.exports.update = async (event) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.text !== "string") {
    console.error("Text must be a string");

    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the note. Text must be a string."
    }
  }

  const params = {
    TableName: 'notes',
    Key: {
      id: event.pathParameters.id
    },
    ExpressionAttributeNames: {
      "#text": "text"
    },
    ExpressionAttributeValues: {
      ":text": data.text,
      ":updatedAt": timestamp
    },
    UpdateExpression: "SET #text = :text, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the note."
    }
  }
};
