const FAQToken = artifacts.require("FAQToken");
const EthSwap = artifacts.require('EthSwap');
module.exports = async function (deployer) {
    await deployer.deploy(FAQToken, '1000000000000000000000000');
    let FAQTokenDeployed = await FAQToken.deployed();
    let ethSwap = await deployer.deploy(EthSwap, FAQTokenDeployed.address);
    await FAQTokenDeployed.transfer(ethSwap.address, '1000000000000000000000000');
};