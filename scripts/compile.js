const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");
const { get } = require("lodash");

// cleanup
const compiledDir = path.resolve(__dirname, "../compiled");
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

// compile
const contractPath = path.resolve(__dirname, "../contracts", "Car.sol");
const contractSource = fs.readFileSync(contractPath, "utf8");
const solcInput = {
  language: "Solidity",
  sources: {
    contract: {
      content: contractSource
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};
const result = JSON.parse(solc.compile(JSON.stringify(solcInput)));

// check errors
if (result?.errors?.length) {
  throw new Error(get(result, "errors[0]", ""));
}

// save to disk
Object.keys(result.contracts).forEach((contractName) => {
  const filePath = path.resolve(compiledDir, `${contractName}.json`);
  fs.outputFileSync(
    filePath,
    JSON.stringify(get(result, `contracts.${contractName}`, {}))
  );
  console.log(`saved compiled contract ${contractName} to ${filePath}`);
});
