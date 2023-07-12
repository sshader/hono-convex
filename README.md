# Convex + Hono HTTP Endpoints

This example demonstrates how to use Convex
[HTTP actions](https://docs.convex.dev/using/http-endpoints) with [Hono](https://hono.dev/) to build a public HTTP API.

This is based off of the [Convex HTTP actions demo](https://github.com/get-convex/convex-demos/tree/main/http) and uses the [honoWithConvex.ts](https://github.com/get-convex/convex-helpers/blob/main/convex/lib/honoWithConvex.ts) helper with this [accompanying post](https://stack.convex.dev/hono-with-convex)

## Running the App

To run the web app:

```
npm install
npm run dev
```

To call the endpoints (e.g. using `curl`):

```
export DEPLOYMENT_NAME="tall-sheep-123"
curl "https://$DEPLOYMENT_NAME.convex.site/api/listMessages/456"
curl -d '{ "author": "User 456", "body": "Hello world" }' \
    -H 'content-type: application/json' "https://$DEPLOYMENT_NAME.convex.site/api/postMessage"
```
