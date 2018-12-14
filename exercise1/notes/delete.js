"use strict";

const dynamodb = require("./interfaces/dynamodb");

module.exports.delete = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    await dynamodb.delete(params).promise();

    return { statusCode: 200 };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't remove the todo item."
    };
  }
};