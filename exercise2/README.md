# HTML Diff in AWS Lambda

Serverless HTML rendering and diffing using the [serverless framework](https://serverless.com), [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) and [pixelmatch](https://github.com/mapbox/pixelmatch).

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


## Usage

The `examples` directory contains Wikipedia and GitHub HTML files for using.

Calling store and diff with Wikipedia's HTML should always match, while GitHub's should not. 
Note: GitHub does not match because it has some JavaScript that controls a loading animation which is not always in the same state across different invocations of Chrome.

### Store HTML file

```bash
# Replace the <id> part with an id and <html> with valid HTML
$ curl -X PUT -H "Content-Type:text/html" http://localhost:3000/store/<id> --data '<html>'
```

Example Result
```json
{
    "url": "http://localhost:4568/stored-html/<id>"
}
```

### Diff HTML file

```bash
# Replace the <id> part with an id and <html> with valid HTML
$ curl -X POST -H "Content-Type:text/html" http://localhost:3000/diff/<id> --data '<html>'
```

Example Results:
```json
{
    "matches": false,
    "original": "http://localhost:4568/stored-html/<id>-original",
    "final": "http://localhost:4568/stored-html/<id>-final",
    "diff": "http://localhost:4568/stored-html/<id>-diff"
}
```
```json
{
    "matches": true,
    "original": "http://localhost:4568/stored-html/<id>-original",
    "final": "http://localhost:4568/stored-html/<id>-final",
    "diff": "http://localhost:4568/stored-html/<id>-diff"
}
```
