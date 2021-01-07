
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

Blockchain.prototype.isChainValid = function (blockchain) {
    let validChain = true;

    //check if the hash of the preivious block 
    //equals the current block's hash.
    for (let index = 1; index < blockchain.length; index++) {
        
        const currentBlock = blockchain[index];
        const previousBlock = blockchain[index - 1];
        if (currentBlock['previousBlockHash'] !== previousBlock['hash']) {
            validChain = false;
        }

        if (validChain) {
            //validate if every signle block inside of the chain
            //has the correct data by re-hashing it.
            const blockHash = this.hashBlock(
                previousBlock['hash'], 
                {transactions: currentBlock['transactions'], index: currentBlock['index']}, 
                currentBlock['nonce']);
            if (blockHash.substring(0, 4) !== '0000') {
                validChain = false;
            }
        }
        
        if (validChain) {
            //check the genesis block
            const genesisBlock = blockchain[0];
            validChain =    genesisBlock['nonce'] === 100 && 
                            genesisBlock['previousBlockHash'] === '0' && 
                            genesisBlock['hash'] === '0' && 
                            genesisBlock['transactions'].length === 0;
        }
        if (!validChain) {
            break;
        }
        
    }


    return validChain;
}

module.exports =  Blockchain;