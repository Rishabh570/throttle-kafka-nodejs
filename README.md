# throttle-kafka-nodejs
Uses kafka-node to implement throttled pub-sub in Node.js

## Getting started

### Pre-requisites

#### 1. Apache Kafka

- Download Kafka as indicated in step 1 in the [official quickstart documentation](https://kafka.apache.org/quickstart).

- Once installed, go to the downloaded Kafka folder. Your Kafka installation version might differ.

```shell
cd ~/Downloads/kafka_2.13-3.3.1/
```

- Run zookeeper and server by running these commands in separate terminal tabs. The commands must be run in the given order.

```shell
bin/zookeeper-server-start.sh config/zookeeper.properties
```

```shell
bin/kafka-server-start.sh config/server.properties
```

If any one of them stops or exits the process, try to restart both. You should only proceed when both of above scripts are in running state and not expiring session.

- Open a new tab in your terminal and create a test topic. We’ll use this topic throughout the article.

```shell
bin/kafka-topics.sh --create --topic testTopic2 --bootstrap-server localhost:9092
```

To confirm if the topic has been successfully created, you can run the following command:

```shell
bin/kafka-topics.sh --describe --topic testTopic2 --bootstrap-server localhost:9092
```

#### 2. (Optional) AppSignal account. Once the account is set-up, make note of two things:

- Application name in AppSignal
  ![Alt text](/assets/image.png)

Update `appName` in config.js file.

- Get your AppSignal `pushApiKey` and update `APPSIGNAL_PUSH_API_KEY` in the env file.

#### 3. Setup free MongoDB cluster on [Atlas](https://www.mongodb.com/atlas/database)

- Once done, update `MONGODB_URL` and `MONGODB_CLUSTER_NAME` in env.
- We're using a collection named `Items` to insert Kafka events, make sure the collection exists on your Atlas cluster.


#### 4. Node.js

You should have Node.js and npm installed with Node.js version >= 16.

### Installation

1. Run `npm install` to install dependencies.
2. Source (or load) the ENV variables containing your MongoDB cluster name & URL and your Appsignal account's Push API key.

NOTE: On macOS, you can do `source .env` to load environment variables. If it doesn't work, try replacing "source" with "." (for more information, refer [this](https://stackoverflow.com/questions/13702425/source-command-not-found-in-sh-shell)) or load the environment variables directly into the terminal.

3. To run the server with nodemon, use `npm run dev`. For production environment, you can use `npm run start`.
3. Visit `http://localhost:8201/consume` to initialize Kafka consumer.
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


## Troubleshooting

### [appsignal][ERROR] The AppSignal extension was installed for architecture 'x64-darwin', but the current architecture is 'arm64-darwin'. Please reinstall the AppSignal package on the host the app is started.

You might face this on m1 macOS where architecture is different. For me, uninstalling and installing the package works. Alternatively, you can also try installing the package using the following command:

```shell
npm i --arch=arm64 --platform=darwin @appsignal/nodejs
```

