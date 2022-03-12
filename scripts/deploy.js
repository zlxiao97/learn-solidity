const { get } = require("lodash");
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// 获取合约
const contractPath = path.resolve(__dirname, "../compiled", "contract.json");
const contractJson = require(contractPath);
const bytecode = get(contractJson, "Car.evm.bytecode.object", "");
const abi = get(contractJson, "Car.abi", {});

// 配置provider
const paramsPath = path.resolve(__dirname, "../provider-params.json");
const provider = new HDWalletProvider(require(paramsPath));

// 初始化web3实例
const web3 = new Web3(provider);

const deploy = async () => {
  // 获取账户
  const accounts = await web3.eth.getAccounts();
  const myAccount = get(accounts, "[1]", "");
  console.log("部署合约的账户：", myAccount);

  // 创建合约并部署;
  console.time("deploy-spending");
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: ["AUDI"]
    })
    .send({
      from: myAccount,
      gas: 500000
    });
  console.timeEnd("deploy-spending");

  console.log("合约部署成功：", get(result, "options.address"));
};

// 部署完毕后结束进程
deploy()
  .catch((err) => console.error(err))
  .finally(() => provider.engine.stop());
