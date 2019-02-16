const rp = require('request-promise');

async function getTokenBalance(tokenAddress, userAddress) {
    let tokenBalances = [];
    for (let i in tokenAddress)
        tokenBalances.push(JSON.parse(await rp.get(`https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress[i]}&address=${userAddress}`)).result);
    return tokenBalances;
}

module.exports = {
    getTokenBalance: getTokenBalance
};