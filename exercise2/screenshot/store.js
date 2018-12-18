const s3Require = require("../interfaces/s3")();

module.exports.handler = async (event) => {
  const { body, pathParameters: { id } } = event;

  try {
    // Wait for s3 require to finish
    const s3 = await s3Require;

    // Store the HTML with the given id and obtain its URL
    const { Location } = await s3.upload({
      Body: body,
      Bucket: "stored-html",
      Key: id,
      ContentType: "text/html"
    }).promise();

    // Return response with the file location
    return {
      statusCode: 200,
      body: JSON.stringify({ url: Location })
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500
    };
  }
};
