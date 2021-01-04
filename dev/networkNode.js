const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuid = require('uuid');
const thisNodeAddress = uuid.v1().split('-').join('')
const port = process.argv[2]


const bitcoin = new blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note:` The transaction will be added to block nr. ${blockIndex}`});
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currData = {
        transactions: bitcoin.pendingTransactions, 
        index:lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currData, nonce);
    //reward for mining
    bitcoin.createNewTransaction(12.5, '00',  thisNodeAddress);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({note: 'New block mined successfully', nodeAddress: thisNodeAddress , block: newBlock});
});

app.listen(port, function () {
    console.log(`- Listening on port ${port}.`);
})