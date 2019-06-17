const BlockClass = require('../Block.js');
const MempoolClass = require('../Mempool');
const hex2ascii = require('hex2ascii');


class BlockController {
   

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app, blockChain) {
        this.app = app;
        this.blockChain = blockChain;
        this.mempool = new MempoolClass.Mempool();
        this.getBlockByIndex();
        this.getStarByBlockHash();
        this.getStarByBlockHeight();
        this.getBlockByWalletAddress(); 
        this.postNewBlock();
        this.addARequestValidation();
        this.validateRequestByWallet();
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
                let block = await this.blockChain.getBlock(req.params.height);
                if(block.body.star){
                    block.body.star = {...block.body.star,"storyDecoded":hex2ascii(block.body.star.story)}
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(block));
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            let address = req.body.address;
            let star = req.body.star;
            if(this.mempool.verifyAddressForValidRequest(address)){
                if(star.story.split(' ').length > 250){
                    res.status(400)
                    .send(`this star story is amazing but it's too long, limit is 250 words`);
                } else {
                    let content = req.body;
                    content.star.story = Buffer.from(star.story).toString('hex');
                    let newBlock = new BlockClass.Block(content);
                    let block = JSON.parse(await this.blockChain.addBlock(newBlock));
                    this.mempool.removeValideRequest(address); // avoid adding the same block twice 
                    block.body.star = {...block.body.star,"storyDecoded":hex2ascii(block.body.star.story)}
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(block));
                }
            }else {
                res.status(400)
                .send(`no valid request was found address ${address}`);
            }
        });
    }

    addARequestValidation(){
        this.app.post("/requestValidation", (req, res) => { 
            let requestObject = this.mempool.setTimeout(req.body.address);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(requestObject));
         });
    }

    validateRequestByWallet(){
        this.app.post("/message-signature/validate", (req, res) => { 
            let validationResult = this.mempool.validateRequest(req.body);
            if(!validationResult){
                res.status(400)
                .send('Invalid signature or a stale address request');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(validationResult));
            }
        });
    }

    getBlockByWalletAddress(){ 
        this.app.get("/stars/address:key", async (req, res) => {
            let walletPredicate = (block) => JSON.parse(block.value).body.address == req.params.key;
            let blocks = await this.blockChain.getBlocksForPredicate(walletPredicate);
            let result = [];
            blocks.forEach(block => {
                block.body.star = {...block.body.star,"storyDecoded":hex2ascii(block.body.star.story)}
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(blocks));
        })
    }

    getStarByBlockHash(){
        this.app.get("/stars/hash:hash", async (req, res) => {
            let blockHashPredicate = (block) => JSON.parse(block.value).hash == req.params.hash;
            let blocks = await this.blockChain.getBlocksForPredicate(blockHashPredicate);
            if(blocks.length == 0){
                res.status(404)
                    .send('Not found');
            } else {
                if(blocks[0]){
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(
                        {...blocks[0],
                             body: {...blocks[0].body,
                                 star: {...blocks[0].body.star,"storyDecoded":hex2ascii(blocks[0].body.star.story)}
                                }
                        }));    
                } else {
                    res.status(404)
                        .send(`No star shining in this block ${req.params.hash}`);
                }
            }
        });
    }

    getStarByBlockHeight(){
        this.app.get("/stars/:height", async (req, res) => {
            let blockHeight = await this.blockChain.getBlockHeight(); 
            if(req.params.height >  blockHeight){
                res.status(404)
                    .send('Not found');
            } else {
                let block = await this.blockChain.getBlock(req.params.height);
                if(block.body.star){
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({...block.body.star,"storyDecoded":hex2ascii(block.body.star.story)}));
                } else {
                    res.status(404)
                        .send(`No star shining in this block ${req.params.height}`);
                }
            }
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app, blockChain) => { return new BlockController(app, blockChain);}