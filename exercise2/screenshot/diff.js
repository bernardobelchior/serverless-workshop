const { PNG } = require("pngjs");
const CDP = require("chrome-remote-interface");
const s3Require = require("../interfaces/s3")();
const pixelmatch = require("pixelmatch");

module.exports.handler = async (event) => {
  const { body, pathParameters: { id } } = event;

  let client;

  try {
    const s3 = await s3Require;

    client = await CDP();

    const { Network, Page, DOM } = client;

    const { Body } = await s3.getObject({
      Bucket: "stored-html",
      Key: id
    }).promise();

    await Network.enable();
    await DOM.enable();
    await Page.enable();
    await DOM.getDocument();

    await DOM.setOuterHTML({ nodeId: 1, outerHTML: Body.toString("utf8") });

    const screenshot1 = await Page.captureScreenshot({ format: "png" });

    await DOM.setOuterHTML({ nodeId: 1, outerHTML: body });
    const screenshot2 = await Page.captureScreenshot({ format: "png" });

    await client.close();

    const image1 = PNG.sync.read(Buffer.from(screenshot1.data, "base64"));
    const image2 = PNG.sync.read(Buffer.from(screenshot2.data, "base64"));
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

    if (client) {
      await client.close();
    }

    return {
      statusCode: 500
    };
  }
};
