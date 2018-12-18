# Note Taking API

This example demonstrates how to run a service locally, using the [serverless-offline](https://github.com/dherault/serverless-offline) plugin.
It provides a REST API to manage notes stored in DynamoDB.
You don't need to change anything outside the `notes` directory and the `serverless.yml` file.

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

And install DynamoDB for local use:
```bash
serverless dynamodb install
```

## Run

You can run this project by either (1) running the API Gateway, allowing you to use it as a REST API; or by (2) using `sls invoke local`, allowing you to use the JSON files in the `examples` directory.


#### Running API

In order to start the API, only the following command is needed:

```bash
npm run dev
```

#### Running Locally

First, you have to the following command in a separate terminal to emulate AWS DynamoDB:
```bash
npm run dynamodb
```

Substitute `<function-name>` with the function name in `serverless.yml` and `<filename.json>` with the name of the file to use.
The environment variable `IS_OFFLINE` is mandatory, otherwise the DynamoDB connection will fail.

```bash
sls invoke local --function <function-name> --path examples/<filename.json> -e IS_OFFLINE=true
```

## Usage

You can create, retrieve, update, or delete notes with the following commands.
The `examples` directory also contains some events in JSON form to use with `sls invoke local`.

### Create a Note

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/notes --data '{ "text": "Learn Serverless" }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,,"updatedAt":1479138570824}%
```

### List all notes

```bash
curl -H "Content-Type:application/json" http://localhost:3000/notes
```

Example output:
```bash
[{"text":"Deploy my first service","id":"ac90feaa11e6-9ede-afdfa051af86","updatedAt":1479139961304},{"text":"Learn Serverless","id":"206793aa11e6-9ede-afdfa051af86","createdAt":1479139943241,"updatedAt":1479139943241}]
```

### Get one note

```bash
# Replace the <id> part with a real id from your notes table
curl -H "Content-Type:application/json" http://localhost:3000/notes/<id>
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"updatedAt":1479138570824}%
```

### Update a note

```bash
# Replace the <id> part with a real id from your notes table
curl -X PUT -H "Content-Type:application/json" http://localhost:3000/notes/<id> --data '{ "text": "Learn Serverless" }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"updatedAt":1479138570824}%
```

### Delete a note

```bash
# Replace the <id> part with a real id from your notes table
curl -X DELETE -H "Content-Type:application/json" http://localhost:3000/notes/<id>
```

No output
