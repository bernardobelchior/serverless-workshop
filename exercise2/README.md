# HTML Diff in AWS Lambda

## Requirements

* [NodeJS](https://nodejs.org/en/)

## Install

First, install the Serverless Framework globally:
```bash
npm install -g serverless
```

Then install the exercise dependencies:
```bash
npm install
```

## Run

You can run this project by either (1) running the API Gateway, allowing you to use it as a REST API; or by (2) using `sls invoke local`, allowing you to use the JSON files in the `examples` directory.

Nevertheless, you have to the following command in a separate terminal to emulate AWS S3:
```bash
npm run s3rver
```


#### Running API

```bash
npm run dev
```

#### Running Locally

Substitute `<function-name>` with the function name in `serverless.yml` and `<filename.json>` with the name of the file to use.
The environment variable `IS_OFFLINE` is mandatory, otherwise S3 will fail.

```bash
sls invoke local --function <function-name> --path examples/<filename.json> -e IS_OFFLINE=true
```

