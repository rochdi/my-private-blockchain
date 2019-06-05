const BlockClass = require('../Block.js');



class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app, blockChain) {
        this.app = app;
        this.blockChain = blockChain;
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:height", async (req, res) => {
            let blockHeight = await this.blockChain.getBlockHeight(); 
            if(req.params.height >  blockHeight){
                res.status(404)
                    .send('Not found');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(await this.blockChain.getBlock(req.params.height)));
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            let content = req.body.data;
            if(content && content.length >0 ){
                let newBlock = new BlockClass.Block(content);
                let block = await this.blockChain.addBlock(newBlock);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(block));
            } else {
                res.status(404)
                .send('Invalid block content');
            }
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app, blockChain) => { return new BlockController(app, blockChain);}