const testData = require('./testData')
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
// console.log(testData);

const valid = bitcoin.isChainValid(testData.chain);
console.log("IsValid: ",valid);

// bitcoin.createNewBlock(789457, 'OIJCSHFZOIUHOI', '78cd56qe4dh3');
// bitcoin.createNewTransaction(101, 'ALEXHT845J5TKCJ2', 'JENN5BG5DF6HT8NG9');
// bitcoin.createNewTransaction(102, 'ALEXHT845J5TKCJ2', 'JENN5BG5DF6HT8NG9');

// bitcoin.createNewBlock(2390, '78cd56qe4dh3', '44556677');
// bitcoin.createNewBlock(2391, '44556677', '789789789');

// const lastBlock = bitcoin.getLastBlock();
// const hashBlock = bitcoin.hashBlock(lastBlock.previousBlockHash, lastBlock.transactions, lastBlock.nonce)
// const proofOfWorkDigit = bitcoin.proofOfWork(lastBlock.previousBlockHash, lastBlock.transactions);
// // console.log(bitcoin.chain[1]);
// console.log(hashBlock);
// console.log(proofOfWorkDigit);
// console.log(bitcoin.hashBlock(lastBlock.previousBlockHash, lastBlock.transactions, proofOfWorkDigit));