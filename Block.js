/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data){
		this.hash = "";
		this.height = 0;
		this.body = data;
		this.previousBlockHash = "";
		this.time = "";
	}
}

module.exports.Block = Block;