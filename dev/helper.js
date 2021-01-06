function Helper() {
    
}

Helper.prototype.addNodeUrl = function (blockchain, nodeUrl) {
    const networkNodes = [...blockchain.networkNodes];
    const nodeAlreadyPresent = networkNodes.includes(nodeUrl.trim());
    const isCurrentNode =  blockchain.currentNodeUrl.trim() === nodeUrl.trim();
    if (! nodeAlreadyPresent && !isCurrentNode) {
        
        networkNodes.push(nodeUrl);
    }
    return  networkNodes;
}
module.exports = Helper;