const { assert } = require('chai');

const Token = artifacts.require('FAQToken');
const EthSwap = artifacts.require('EthSwap');

// Convert to wei value
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap;
    before(async () => {
        token = await Token.new('1000000000000000000000000');
        ethSwap = await EthSwap.new(token.address);
        await token.transfer(ethSwap.address, tokens('1000000'));
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, 'FAQToken');
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, 'Ethswap Instant Exchange');
        })

        it('contracts has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    });

    describe('EthSwap buy tokens', async () => {
        let result;
        before(async () => {
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('2', 'ether') });
        })
        it('Allows user to instantly purchase 200 tokens', async () => {
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('200'));
            let etwSapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(etwSapBalance.toString(), tokens('999800'));
            etwSapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(etwSapBalance.toString(), web3.utils.toWei('2', 'Ether'))

            // Test logs
            const event = result.logs[0].args;
            assert.equal(event._account, investor)
            assert.equal(event._token, token.address)
            assert.equal(event._amount.toString(), tokens('200').toString())
            assert.equal(event._rate.toString(), '100');
        })

    })

    describe('EthSwap sell tokens', async () => {
        let result;
        before(async () => {
            await token.approve(ethSwap.address, tokens('100'), { from: investor });
            result = await ethSwap.sellTokens(tokens('100'), { from: investor });
        })
        it('Allows user to instantly sell 100 tokens', async () => {
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'));
            let etwSapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(etwSapBalance.toString(), tokens('999900'))
            etwSapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(etwSapBalance.toString(), web3.utils.toWei('1', 'ether'))
            // Test logs
            const event = result.logs[0].args
            assert.equal(event._account, investor)
            assert.equal(event._token, token.address)
            assert.equal(event._amount.toString(), tokens('100').toString())
            assert.equal(event._rate.toString(), '100')
        })

        it('Fail transaction. Investor can\'t sell more tokens that they have', async () => {
            await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })

    })

    describe('EthSwap withdraw money', async () => {
        let balanceInvestorBefore, balanceEthSwapBefore;
        before(async () => {
            balanceEthSwapBefore = await web3.eth.getBalance(ethSwap.address);
            balanceInvestorBefore = await web3.eth.getBalance(investor);
            await ethSwap.withdrawMoney({ from: investor });
        })

        it('Allow to withdraw all money to sender', async () => {
            let etwSapBalance = await web3.eth.getBalance(ethSwap.address);
            let currentInvestorBalance = await web3.eth.getBalance(investor);
            assert.equal(etwSapBalance.toString(), '0');
            assert.notEqual(balanceEthSwapBefore.toString(), '0');
            assert.notEqual(currentInvestorBalance.toString(), balanceInvestorBefore.toString());
        })
    })

})