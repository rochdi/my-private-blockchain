# Private Blockchain

 Private Blockchain, in this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB. Interaction with this private block chain can be done via API.
 this blockchain implements mempool mechanics. 

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. start the the API: node app.js

## API
1. get block by height GET http://localhost:8000/block/[blockheight]
```
{
    "hash": "f365cda92493c151a91cc429c91273f05cb197d0bcafb5807c1c50a00990cb70",
    "height": 3,
    "body": {
        "address": "1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW",
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "previousBlockHash": "dcfa342335e9efa7424142e352d8b82b4b90354b99b16912f619ef9ab66e98be",
    "time": "1560088428"
}
```
2. get all blocks for a wallet GET http://localhost:8000/wallet/[key]
```
[
    {
        "hash": "8152225832b3ff0fb78451e0117dd7e0e30c0a73c66ce5f68815fe7e8a2dc8fd",
        "height": 1,
        "body": {
            "address": "1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW",
            "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "previousBlockHash": "057dc0f327fed6f588882d89587385fb9c2eb28176ab07c979509395530a63ea",
        "time": "1560087795"
    },
    {
        "hash": "dcfa342335e9efa7424142e352d8b82b4b90354b99b16912f619ef9ab66e98be",
        "height": 2,
        "body": {
            "address": "1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW",
            "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "previousBlockHash": "8152225832b3ff0fb78451e0117dd7e0e30c0a73c66ce5f68815fe7e8a2dc8fd",
        "time": "1560088161"
    },
    {
        "hash": "f365cda92493c151a91cc429c91273f05cb197d0bcafb5807c1c50a00990cb70",
        "height": 3,
        "body": {
            "address": "1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW",
            "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "previousBlockHash": "dcfa342335e9efa7424142e352d8b82b4b90354b99b16912f619ef9ab66e98be",
        "time": "1560088428"
    }
]
```
3. get star by block height GET http://localhost:8000/stars/[blockheight]
```
{
    "dec": "68° 52' 56.9",
    "ra": "16h 29m 1.0s",
    "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
    "storyDecoded": "Found star using https://www.google.com/sky/"
}
```
4. get star by its block hash http://localhost:8000/stars/hash/[blockhash]

```
{
    "dec": "68° 52' 56.9",
    "ra": "16h 29m 1.0s",
    "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
    "storyDecoded": "Found star using https://www.google.com/sky/"
}
```

4. create a new block POST http://localhost:8000/block ex payload: 
```
{
	"address": "1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW",
    "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
}
```
5. post a request to the mempool for a given address: POST localhost:8000/requestValidation

```
{
    "address":"1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW"
}
```

6.  validate a the request with a signature:  localhost:8000/validate

```
{
    "address":"1Kf3d9d8JZCFsKZPa8VQMk4ewAh5PHhheW",
 	"signature":"H7STOqLkAeAq2gT3hpKo+8LhYLQ3lkK4ZV57lV+JR0ytWaccpSXN1cMLmi93PmNbgF2/OKnNgssqETm8jzDrfY4="
}
```

