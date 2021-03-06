"use strict";

const AWS = require("aws-sdk");

async function create () {
  let options = {};

  if (process.env.IS_OFFLINE) {
    options = {
      s3ForcePathStyle: true, // Needed to use with s3rver
      endpoint: "http://localhost:4568"
    };
  }

  const s3 = new AWS.S3(options);

  try {
    await s3.createBucket({
      Bucket: "stored-html"
    }).promise();
  } catch (e) {
    if (e.code !== "BucketAlreadyExists") {
      console.error(e);
      process.exit(1);
    }
  }

  try {
    await s3.createBucket({
      Bucket: "screenshots"
    }).promise();
  } catch (e) {
    if (e.code !== "BucketAlreadyExists") {
      console.error(e);
      process.exit(1);
    }
  }

  return s3;
}

module.exports = create;
