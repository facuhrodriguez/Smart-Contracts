const { assert } = require('chai');
const { ethers } = require("ethers");
const Votes = artifacts.require('Votes');
const Governor = artifacts.require('TestGovernor');
const TimeLockController = artifacts.require("@openzeppelin/contracts/governance/TimeLockController.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Governor Tests...', ([deployer, investor]) => {
    let votes, govern, timeLock, blockNumber;
    let totalAvailablesVoters = 1000;
    before(async () => {
        votes = await Votes.new(totalAvailablesVoters);
        blockNumber = await web3.eth.getBlockNumber();
        timeLock = await TimeLockController.new(1, [investor], [investor]);
        govern = await Governor.new(votes.address, timeLock.address);
    })

    describe('VotesToken deployment', async () => {
        it('VotesToken has a name', async () => {
            const name = await votes.name();
            assert.equal(name, 'National law');
        })
    })

    describe('Governor deployment', async () => {
        it('Governor has address', async () => {
            const address = await govern.address;
            assert.exists(address);
        })
        it('Voting delay', async () => {
            const votingDelay = await govern.votingDelay();
            assert.equal(votingDelay, 1);
        })
        it("Voting quorum must be the half of all tokens", async () => {
            const quorum = await govern.quorum(blockNumber);
            assert.equal(quorum, totalAvailablesVoters / 2);
        })
    })

    describe('Proposal creation', async () => {
        before(async () => {
            const teamAddress = '0xCd9d39E3354b00110E53983069e2d035270ae347';
            const grantAmount = 20;

            const transferCalldata = votes.interface.encodeFunctionData("transfer", [teamAddress, grantAmount]);

            const propose = await governor.propose(
                [votes.address],
                [0],
                [transferCalldata],
                "Proposal #1: Give grant to team",
            );
        })
        it('Cast a vote', async () => {

        })
    })


})