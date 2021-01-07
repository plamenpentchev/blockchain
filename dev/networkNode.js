const express = require('express');
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuid = require('uuid');
const rp = require('request-promise');


const app = express();
const thisNodeAddress = uuid.v1().split('-').join('')
const port = process.argv[2];
const mineReward ={amount:12.5, sender: '00', recipient:thisNodeAddress};


const bitcoin = new blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({note:` The transaction will be added to block nr. ${blockIndex}`});
});

app.post('/transaction/broadcast', function (req, res) {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

    const promises = [];
    bitcoin.networkNodes.forEach(nodeUrl => {
        const requestOptions = {
            uri: `${nodeUrl}/transaction`,
            method:'POST',
            body:newTransaction,
            json: true
        }
        promises.push(rp(requestOptions));
    });
    Promise.all(promises).then(data => {
        res.json({note:'Transaction created and broadcastet successfully.'})
    });
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
    // //reward for mining
    // bitcoin.createNewTransaction(12.5, '00',  thisNodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    const promisses = [];
    bitcoin.networkNodes.forEach(nodeUrl => {
        const requestOptions = {
            uri: `${nodeUrl}/receive-new-block`,
            method:'POST',
            body:{
                newBlock: newBlock
            },
            json:true
        }
        promisses.push(rp(requestOptions));
    });
    Promise.all(promisses).then(data => {
        const requestOptions = {
            uri:`${bitcoin.currentNodeUrl}/transaction/broadcast`,
            method:'POST',
            json:true,
            body: {
                amount:12.5,
                sender:'00',
                recipient: thisNodeAddress
            }
        }
        return rp(requestOptions);
    });
    
    res.json({
        note: 'New block mined & broadcast successfully', 
        nodeAddress: thisNodeAddress , 
        block: newBlock});
});

app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions =[];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock: newBlock
        });
    }
})

/**
 * will register a node on its own server and will broadcast this new node across
 * the whole network(to all of the others network nodes).
 */
app.post('/register-and-broadcast-node', function (req, res) {
    
    const newNodeUrl = req.body.newNodeUrl;
     //register the new node with the node which endpoint has been addressed.
     addNodeUrl(bitcoin, newNodeUrl);
    
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
   
   
    Promise.all(regNodesPromises)
    .then(data => {
         //register all existent nodes with the new node.
        const bulkRegisterOptions = {
            uri:`${newNodeUrl}/register-nodes-bulk`,
            method:'POST',
            json: true,
            body:{
                allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
            }
        }
        return rp(bulkRegisterOptions);}
    )
    .then(data => {
        res.json({note:'New node registered with network successfully.'});
    })
    .catch(err => console.log(err));
    
});

/**
 * will regiter a node with the network. All network node instances
 * will accept new network nodes on this endpoint.
 */
app.post('/register-node', function (req, res) {
    
    const newNodeUrl = req.body.newNodeUrl;
    addNodeUrl(bitcoin, newNodeUrl);
    
    res.json({note: 'New node registered successfully.'});
})

/**
 * will register miltiple nodes at once.
 */
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    console.log(allNetworkNodes);
    allNetworkNodes.forEach(networkNodeUrl => {
        addNodeUrl(bitcoin, networkNodeUrl);
    });
    res.json('Bulk registration successful.');
})

/**
 * will implement the longest chain consensus algorithm
 */
app.get('/consensus', function (req, res) {
    const requestPromisses = [];
    //make request to all nodes in the network to access the blockahins hosted on each of them.
    bitcoin.networkNodes.forEach(nodeUrl => {
        const requestOptions = {
            uri: `${nodeUrl}/blockchain`,
            method:'GET',
            json:true
        }
        requestPromisses.push(rp(requestOptions));
    });

    Promise.all(requestPromisses).then(blockchains => {
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
         
        
        //look for a longer chain on each blockchain in the network.
        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > maxChainLength ) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }
        });
        if (!newLongestChain || 
            (newLongestChain && !bitcoin.isChainValid(newLongestChain))) {
                //current chain is the longest or there is a longer chain
                //but is not valid
            res.json({
                note:'Current chain has not been reaplaced.',
                chain: bitcoin.chain
            });
        } else {
            //there is a longer chain than the current so replace it
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransactions = newPendingTransactions;
            res.json({
                note:'This chain has been replaced.',
                chain:bitcoin.chain
            })
        }
    });
})

app.listen(port, function () {
    console.log(`- Listening on port ${port}.`);
})

const addNodeUrl = function (blockchain, nodeUrl) {
    const nodeAlreadyPresent = blockchain.networkNodes.includes(nodeUrl.trim());
    const isCurrentNode =  blockchain.currentNodeUrl.trim() === nodeUrl.trim();
    if (! nodeAlreadyPresent && !isCurrentNode) {
        
        blockchain.networkNodes.push(nodeUrl);
    }
}