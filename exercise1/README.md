<!--
description: ''
layout: Doc
framework: v1
platform: AWS
language: nodeJS
-->
# Note Taking API

This example demonstrates how to run a service locally, using the [serverless-offline](https://github.com/dherault/serverless-offline) plugin.
It provides a REST API to manage notes stored in DynamoDB.

## Use-case

Test your service locally, without having to deploy it first.

## Setup

```bash
npm install
serverless dynamodb install
serverless offline start
serverless dynamodb migrate (this imports schema)
```

## Run service offline

```bash
serverless offline start
```

## Usage

You can create, retrieve, update, or delete notes with the following commands:

### Create a Notes

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
