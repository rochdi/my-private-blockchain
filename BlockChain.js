/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    async generateGenesisBlock(){
        let count = await this.bd.getBlocksCount();
        if(count === 0 ) {
            console.log("Creating Genesis Block");
            await this.addBlock(new Block.Block("I'm the first block - Genesis"))
            console.log("Blockchain initialized");
        }
    }

    // Get block height, it is a helper method that return the height of the blockchain
    async getBlockHeight() {
        let count = await this.bd.getBlocksCount();
        return count;
    }

    async addBlock(block) {
        const height = await this.getBlockHeight();
        block.height = height;
        block.time = new Date().getTime().toString().slice(0,-3);

        if (block.height > 0) {
          const previousBlock = await this.getBlock(height-1);
          block.previousBlockHash = previousBlock.hash;
        }

        block.hash = this.getBlockHash(block);
        return await this.persistBlock(block);
      }


    // Get Block By Height
    async getBlock(height) {
        return JSON.parse(await this.bd.getLevelDBData(height));
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        let block = await this.getBlock(height);
        let referenceHash = block.hash;
        block.hash= '';
        return referenceHash === this.getBlockHash(block);
    }

    async validateLinkForBlock(height){
        if(height === 0) {return true;}

        let block = await this.getBlock(height);
        let previousBlock = await this.getBlock(height-1);
        return block.previousBlock === previousBlock.hash;
    }

    // Validate Blockchain
    async validateChain() {
        let height = await this.getBlockHeight();
        
        for (let index = 0; index < height; index++) {
            if(! await this.validateBlock(index)){
                return false;
            }

            if(! await this.validateLinkForBlock(index)){
                return false;
            }
        }

        return true;
    }

    getBlockHash(block) { return SHA256(JSON.stringify(block)).toString()};

    async persistBlock(block){
        return await this.bd.addLevelDBData(block.height, JSON.stringify(block));
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;
