
const sha256 = require('sha256');
const uuid = require('uuid');

const currentNodeUrl = process.argv[3];

function Blockchain(params) {
    this.chain = [];
    this.pendingTransactions =[];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    // create the genesis block right away in constructor
    this.createNewBlock(100, '0', '0')
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
        transactions: this.pendingTransactions
    };
    this.pendingTransactions= [];
    this.chain.push(newBlock);
    return newBlock;
}
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount:amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid.v1().split('-').join('')
    };
    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function (newTRansaction) {
    this.pendingTransactions.push(newTRansaction);
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockTransactions, nonce) {
    return sha256(`${previousBlockHash}${JSON.stringify(currentBlockTransactions)}${nonce.toString()}`)
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash,currentData, nonce)
    while (hash.substr(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentData, nonce);
    }
    return nonce;
}

module.exports =  Blockchain;