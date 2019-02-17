const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const rp = require('../request/request');
const guid = require('guid');
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');
const db = require('./../db/db');
const utils = require('./../utils/utils');
const token = require('./../tokens/tokens');
const { ShapeShift } = require('../shapeshift/shapeshift');
require('dotenv').config({path: "./../../.env"});

async function start(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    if (user)
        return ctx.reply(Text.keyboard.start.text, Markup
            .keyboard(Keyboard.start)
            .resize()
            .extra()
        );
    else
        return createAccount(ctx);
}

function createAccount(ctx) {
    const key = guid.create().value;

    utils.client.set(key, JSON.stringify({
        userID: ctx.message.from.id,
        nickname: ctx.message.from.username,
        lifetime: Date.now() + (utils.keyLifeTime * 1000)
    }), 'EX', utils.keyLifeTime);

    return ctx.reply(Text.inline_keyboard.create_wallet.text, Extra.markup(Keyboard.create_wallet(key)));
}

function sendTx(ctx) {
    return ctx.reply("Change", Keyboard.txVariants)
}

function celerChange(ctx) {
    return ctx.reply(Text.inline_keyboard.celer.text, Extra.markup(Keyboard.celerInline()))
}

function goToAccount(ctx) {
    return ctx.reply(Text.keyboard.account.text, Markup
        .keyboard(Keyboard.account)
        .resize()
        .extra()
    )
}

async function getAddresses(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\`` + `\n\nBitcoin address: \`\`\`${user.bitcoinAddress}\`\`\``;
    return ctx.reply(text, { parse_mode: 'Markdown' });
}

function back(ctx) {
    start(ctx);
}

async function getBalances(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const balanceETHRopsten = await utils.web3Ropsten.eth.getBalance(user.ethereumAddress);
    const balanceETHMain = await utils.web3Mainnet.eth.getBalance(user.ethereumAddress);
    const tokensTickers = Object.keys(token.supportedTokens);
    const tokenAddresses = Object.values(token.supportedTokens);
    const tokenBalances = await rp.getTokenBalance(tokenAddresses, user.ethereumAddress);
    const btcBalance = await rp.getBTCBalance(user.bitcoinAddress);
    console.log(tokenBalances);
    let msg = `*Mainnet Ethereum:* ${balanceETHMain/1e18} or ${(Number(await utils.course.convert("ETH", "USD", balanceETHMain/1e18)))}$ \n\n*Ropsten Ethereum:* ${balanceETHRopsten/1e18} or ${(Number(await utils.course.convert("ETH", "USD", balanceETHRopsten/1e18)))}$\n\n*BTC:* ${btcBalance} or ${(Number(await utils.course.convert("BTC", "USD", btcBalance)))}$\n\n`;
    let counter = 0;
    for (let i in tokensTickers) {
        msg += `*${tokensTickers[i]}:* ${Number(tokenBalances[counter])/1e18}\n\n`;
        counter++;
    }
    ctx.reply(msg, { parse_mode: 'Markdown' });
}

function createInstance(ABI, address) {
    return new utils.web3Mainnet.eth.Contract(ABI, address);
}

async function get(instance, methodName, addressFrom, parameters) {
    return await instance.methods[methodName](...parameters).call({from: addressFrom});
}

async function getBalance(tokenAddress, address) {
    const instance = createInstance(token.ABI, tokenAddress);
    return await get(instance, 'balanceOf', address, [address]);
}

async function exchange(ctx) {
    const allString = ctx.message.text;
    const data = allString.split(' ');
    console.log(data);
    const indexOfFirstCurrency = 1;
    const indexOfSecondCurrency = 2;
    const indexOfDepositAmount = 3;

    const cur = {
        "BTC": "Bitcoin",
        "ETH": "Ethereum"
    };
    return;
    if (Object.keys(cur).indexOf(data[indexOfFirstCurrency]) == -1 || Object.keys(cur).indexOf(data[indexOfSecondCurrency]) == -1) {
        ctx.reply("Incorrect");
        return ctx.scene.leave();
    }

    const currencyFrom = cur[data[indexOfFirstCurrency]];
    const currencyTo = cur[data[indexOfSecondCurrency]];
    const amountFrom = data[indexOfDepositAmount];

    const user = await db.user.find.oneByID(ctx.message.from.id);
    const fromAddress = user[`${currencyFrom.toLowerCase()}Address`];
    const secondCurrencyAddress = (Object.keys(token.supportedTokens)).indexOf(currencyTo) == -1 ? user[`${currencyTo.toLowerCase()}Address`] : user[`ethereumAddress`];
    console.log(secondCurrencyAddress)
    const toAddress = await ShapeShift.investment.getExchangeAddress(secondCurrencyAddress, ShapeShift.pairs[currencyFrom.toLowerCase()][currencyTo.toLowerCase()], amountFrom, fromAddress);
    const value = JSON.stringify({
        currencyFrom: currencyFrom,
        currencyTo: currencyTo,
        fromUserID: ctx.message.from.id,
        fromAddress: fromAddress,
        toAddress: toAddress.success.deposit,
        amount: amountFrom,
        receiveAmount: toAddress.success.withdrawalAmount,
        amountInUSD: await utils.course.convert(utils.currency[currencyFrom].ticker, "USD", amountFrom),
        lifetime: Date.now() + (utils.keyLifeTime * 1000),
    });

    const key = guid.create().value;

    utils.client.set(key, value, 'EX', utils.keyLifeTime);

    ctx.reply("Deposit Sum: "
        + amountFrom + " " + utils.currency[currencyFrom].ticker+"\nReceive Sum: "
        + toAddress.success.withdrawalAmount + " " + utils.currency[currencyTo].ticker, Extra.markup(Keyboard.create_exchange_transaction(key)));

    return ctx.scene.leave();
}

module.exports = {
    start: start,
    getAddresses: getAddresses,
    goToAccount: goToAccount,
    getBalances: getBalances,
    back: back,
    sendTx:sendTx,
    celerChange:celerChange,
    exchange: exchange
};
