/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts:
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

const Web3Bank = artifacts.require("Web3Bank");

module.exports = async function (callback) {
  const deployed = await Web3Bank.deployed();

  const currentValue = (await deployed.read()).toNumber();
  console.log(`Current Web3Bank value: ${currentValue}`);

  const { tx } = await deployed.write(currentValue + 1);
  console.log(`Confirmed transaction ${tx}`);

  const updatedValue = (await deployed.read()).toNumber();
  console.log(`Updated Web3Bank value: ${updatedValue}`);

  callback();
};
