const { PNG } = require("pngjs");
const Chrome = require('../interfaces/chrome');
const s3Require = require("../interfaces/s3")();
const pixelmatch = require("pixelmatch");

// Create Chrome Remote Interface
let chrome = new Chrome();

module.exports.handler = async (event) => {
  const { body: newHTML, pathParameters: { id } } = event;

  try {
    // Wait for s3 require to finish
    const s3 = await s3Require;

    // Initialize Chrome
    await chrome.init();

    // Obtain HTML file with given id: the "original" HTML file
    // Note that getObject will return a Buffer, not a String
    let { Body: originalHTML } = await s3.getObject({
      Bucket: "stored-html",
      Key: id
    }).promise();


    // Convert HTML file to string
    originalHTML = originalHTML.toString();

    // Set the original HTML and take screenshot
    await chrome.setHTML(originalHTML);
    const image1 = await chrome.captureScreenshot();

    // Set the given HTML and take screenshot
    await chrome.setHTML(newHTML);
    const image2 = await chrome.captureScreenshot();

    // Initialize the image that will contain the different between images
    const diff = new PNG({ width: image1.width, height: image1.height });

    // Calculate the difference. `diff.data` now has the image diff.
    // `pixelDiff` is the number of different pixels between `image1` and `image2`
    const pixelDiff = pixelmatch(image1.data, image2.data, diff.data, image1.width, image1.height, { threshold: 0 });

    // Upload results to S3 bucket and destructure the URLs
    const [{ Location: original }, { Location: final }, { Location: diffUrl }] = await Promise.all([
      s3.upload({
        Body: PNG.sync.write(image1),
        Bucket: "screenshots",
        Key: `${id}-original`,
        ContentType: "image/png"
      }).promise(),
      s3.upload({
        Body: PNG.sync.write(image2),
        Bucket: "screenshots",
        Key: `${id}-final`,
        ContentType: "image/png"
      }).promise(),
      s3.upload({
        Body: PNG.sync.write(diff),
        Bucket: "screenshots",
        Key: `${id}-diff`,
        ContentType: "image/png"
      }).promise()
    ]);

    // Close chrome
    await chrome.close();

    // Return response
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

    // Close chrome
    await chrome.close();

    return {
      statusCode: 500
    };
  }
};
