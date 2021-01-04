const express = require('express');
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuid = require('uuid');
const rp = require('request-promise');

const app = express();
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

/**
 * will register a node on its own server and will broadcast this new node across
 * the whole network(to all of the others network nodes).
 */
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (!bitcoin.networkNodes.includes(newNodeUrl)) {
        //register the new node with itself.
        bitcoin.networkNodes.push(newNodeUrl);
    }
    //broadcast the new node to all the other nodes,
    //that are already present in the network.
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        //... /register-node
        const requestOptions = {
            uri: `${networkNodeUrl}/register-node`,
            method: 'POST',
            json: true,
            body:{
                newNodeUrl: newNodeUrl
            }
        }
        regNodesPromises.push(rp(requestOptions));
    });
    //register all existent nodes with the new node.
    Promise.all(regNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri:`${newNodeUrl}/register-nodes-bulk`,
            method:'POST',
            json: true,
            body:{
                allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
            }
        }
        return rp(bulkRegisterOptions)
        .then(data => {
            res.json(){note:'New node registered with network successfully.'};
        });
    });
    
});

/**
 * will regiter a node with the network. All network node instances
 * will accept new network nodes on this endpoint.
 */
app.post('/register-node', function (req, res) {
    
})

/**
 * will register miltiple nodes at once.
 */
app.post('/register-nodes-bulk', function (req, res) {
    
})


app.listen(port, function () {
    console.log(`- Listening on port ${port}.`);
})