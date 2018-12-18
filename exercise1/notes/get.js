"use strict";

const dynamodb = require("../interfaces/dynamodb");

module.exports.get = async (event) => {
  const params = {
    TableName: 'notes',
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    const result = await dynamodb.get(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the note."
    };
  }
};
