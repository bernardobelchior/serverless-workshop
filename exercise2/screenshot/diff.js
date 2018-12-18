const { PNG } = require("pngjs");
const Chrome = require('../interfaces/chrome');
const s3Require = require("../interfaces/s3")();
const pixelmatch = require("pixelmatch");

let chrome = new Chrome();

module.exports.handler = async (event) => {
  const { body: newHTML, pathParameters: { id } } = event;

  try {
    const s3 = await s3Require;

    await chrome.init();

    let { Body: originalHTML } = await s3.getObject({
      Bucket: "stored-html",
      Key: id
    }).promise();

    originalHTML = originalHTML.toString();

    await chrome.setHTML(originalHTML);
    const image1 = await chrome.captureScreenshot();

    await chrome.setHTML(newHTML);
    const image2 = await chrome.captureScreenshot();

    const diff = new PNG({ width: image1.width, height: image1.height });

    const pixelDiff = pixelmatch(image1.data, image2.data, diff.data, image1.width, image1.height, { threshold: 0 });

    const [{ Location: original }, { Location: final }, { Location: diffUrl }] = await Promise.all([
      s3.upload({
        Body: PNG.sync.write(image1),
        Bucket: "stored-html",
        Key: `${id}-original`,
        ContentType: "image/png"
      }).promise(),
      s3.upload({
        Body: PNG.sync.write(image2),
        Bucket: "stored-html",
        Key: `${id}-final`,
        ContentType: "image/png"
      }).promise(),
      s3.upload({
        Body: PNG.sync.write(diff),
        Bucket: "stored-html",
        Key: `${id}-diff`,
        ContentType: "image/png"
      }).promise()
    ]);

    await chrome.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        matches: !pixelDiff,
        original,
        final,
        diff: diffUrl
      })
    };

  } catch (e) {
    console.error(e);

    await chrome.close();

    return {
      statusCode: 500
    };
  }
};
