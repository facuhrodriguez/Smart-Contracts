const Votes = artifacts.require("Votes");
const TestGovernor = artifacts.require("TestGovernor.sol");
const timeLockController = artifacts.require("@openzeppelin/contracts/governance/TimeLockController.sol");

module.exports = async function (deployer) {
    await deployer.deploy(Votes, '1000000000000000000000000');
    await deployer.deploy(timeLockController, 1, ['0x7fFFD670FCA1DCe58B00dCB25f238D0bcebfC39E'], ['0x7fFFD670FCA1DCe58B00dCB25f238D0bcebfC39E']);
    const votes = await Votes.deployed();
    const timeLock = await timeLockController.deployed();
    await deployer.deploy(TestGovernor, votes.address, timeLock.address);
};
