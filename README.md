# Private Blockchain

 Private Blockchain, in this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB. Interaction with this private block chain can be done via API.

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. start the the API: node app.js

## API
1. GET http://localhost:8000/block/[blockheight]
2. POST http://localhost:8000/block ex payload: {
	"data":"this is new block"
}
