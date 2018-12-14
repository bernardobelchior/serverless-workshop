"use strict";

const dynamodb = require("./interfaces/dynamodb");

module.exports.list = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  try {
    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the todo item."
    };
  }
};
