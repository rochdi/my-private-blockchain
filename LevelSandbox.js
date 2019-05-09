/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        return this.db.get(key);
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise((resolve, reject) => {
          self.db.put(key, value).then(
            (err) => {
                err && reject(err);
                resolve(value);
            })
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        let count = 0;
        return new Promise((resolve, reject) => {
            self.db.createReadStream()
                .on('data', (data) => { count++; })
                .on('error', (error) => reject())
                .on('close', () => resolve(count))
                .on('end', () => resolve(count));
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;
