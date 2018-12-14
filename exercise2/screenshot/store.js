const s3Require = require("../interfaces/s3")();

module.exports.handler = async (event) => {
  const { body, pathParameters: { id } } = event;

  try {
    const s3 = await s3Require;

    const { Location } = await s3.upload({
      Body: body,
      Bucket: "stored-html",
      Key: id,
      ContentType: "text/html"
    }).promise();

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
