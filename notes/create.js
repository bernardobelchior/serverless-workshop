"use strict";

const uuid = require("uuid");
const dynamodb = require("./interfaces/dynamodb");

module.exports.create = async (event) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.text !== "string") {
    console.error("Text must be a string");

    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item."
    }
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.text,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  try {
    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: e.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item."
    };
  }
};
