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

    /* TODO: Obtain HTML stored in 'stored-html' Bucket. Don't forget to convert to String. */

    // Set the original HTML and take screenshot
    await chrome.setHTML(originalHTML);
    const image1 = await chrome.captureScreenshot();

    /* TODO: Set the new HTML and capture screenshot */

    // Initialize the image that will contain the different between images
    const diff = new PNG({ width: image1.width, height: image1.height });

    // Calculate the difference. `diff.data` now has the image diff.
    // `pixelDiff` is the number of different pixels between `image1` and `image2`
    const pixelDiff = pixelmatch(image1.data, image2.data, diff.data, image1.width, image1.height, { threshold: 0 });

    /* TODO: Upload original, new and diff images to Bucket named 'screenshots' */

    // Close chrome
    await chrome.close();

    // Return response
    return {
      statusCode: 200,
      body: JSON.stringify({
        matches: !pixelDiff,
        /* TODO: return URLs for stored screenshots */
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
