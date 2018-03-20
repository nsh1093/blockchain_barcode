const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, smart, previousHash='', hash='', referredHash){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=hash;
        this.referredHash=referredHash;
        this.smart = smart;
    }

    calculateHash(){
        if(this.referredHash!=null){
            return 1+SHA256(this.index + this.previousHash + this.timestamp + this.referredHash + JSON.stringify(this.data)).toString();
    }
        else{
            return 0+SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
        }
}
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "20/03/2018", {barcode: 1234556}, "0", "1");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        console.log(this.chain.length);
        for(var i=0; i<this.chain.length; i++){
            // console.log(i);
            if(newBlock.data.barcode==this.chain[i].data.barcode){
                console.log("chain= "+ this.chain[i].data.barcode + " , newBLOCK"+ newBlock.data.barcode);
                newBlock.referredHash = this.chain[i].hash;
                console.log("naccho:  "+ this.chain[i].smart.scname);
                if(this.chain[i].smart.scname==false){
                    if(newBlock.data.name!=this.chain[i].data.name){
                        console.log("HACKING ATTEMPTED");
                    }
                }
            }
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        }
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let munshigCoin = new Blockchain();
munshigCoin.addBlock(new Block(1, "21/12/2017", {barcode: 0101010101, name: "maggi", quantity: 500, price: 50 }, {scname: false, scquantity: false, days:7, price_range:5}));
munshigCoin.addBlock(new Block(2, "01/01/2018", {barcode: 0202020202}));
munshigCoin.addBlock(new Block(3, "01/01/2018", {barcode: 0101010101, name: "mnagga"}));
// munshigCoin.chain[1].data = { amount: 100};
// munshigCoin.chain[1].hash = munshigCoin.chain[1].calculateHash;

console.log("is chain valid? " + munshigCoin.isChainValid());

console.log(JSON.stringify(munshigCoin, null, 4));


