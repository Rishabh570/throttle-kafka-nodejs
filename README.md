# throttle-kafka-nodejs
Uses kafka-node to implement throttled pub-sub in Node.js

## How to run

1. `npm install`
2. Setup free MongoDB cluster on Atlas and update MONGODB_CLUSTER_NAME in env. We're using a collection named `Items` to insert Kafka events, make sure it exists too.
3. Visit `http://localhost:8201/consume` to initialize Kafka consumer
4. Produce some dummy events, feel free to use this CURL:

```
curl --location --request POST 'http://localhost:8201/produce' \
--header 'Content-Type: application/json' \
--data-raw '{
    "events": [
        {
            "name": "name11534",
            "rating": "45",
            "price": 50,
            "hash": "hashhhh-STARTINGEVENT"
        },
        {
            "name": "name11594",
            "rating": "45",
            "price": 54,
            "hash": "hashhhh-bes223"
        },
        {
            "name": "name19824",
            "rating": "75",
            "price": 90,
            "hash": "hashhhh-pos223"
        },
        {
            "name": "name11534",
            "rating": "45",
            "price": 50,
            "hash": "hashhhh-asd223"
        },
                {
            "name": "name11534",
            "rating": "45",
            "price": 50,
            "hash": "hashhhh-2csc"
        },
        {
            "name": "name11594",
            "rating": "45",
            "price": 54,
            "hash": "hashhhh-12fsa"
        },
        {
            "name": "name19824",
            "rating": "75",
            "price": 90,
            "hash": "hashhhh-97kok"
        },
        {
            "name": "name11534",
            "rating": "45",
            "price": 50,
            "hash": "hashhhh-kjd782"
        },
        {
            "name": "name19824",
            "rating": "75",
            "price": 90,
            "hash": "hashhhh-27knks"
        },
        {
            "name": "name11534",
            "rating": "45",
            "price": 50,
            "hash": "hashhhh-9828jhd"
        }
    ]
}'
```

That's it, you should be able to see consumption on your terminal. You can tweak batch size and queue concurrency to study the behavior.
