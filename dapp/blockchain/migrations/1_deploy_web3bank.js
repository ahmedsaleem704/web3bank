const Web3Bank = artifacts.require("Web3Bank");

module.exports = function (deployer) {
  deployer.deploy(Web3Bank);
};
