import { ethers } from "hardhat";

import { baseSepoliaChainlinkConfig } from "../../chainlinkConfig";
import { nullBytes32 } from "../../util";
import { createXAddress } from "../../externalContractAddress";

export const main = async () => {
  const salt = nullBytes32;
  const createX = await ethers.getContractAt("CreateX", createXAddress);

  const JWKSAutomatedOracle = await ethers.getContractFactory(
    "JWKSAutomatedOracle"
  );
  const { data } = await JWKSAutomatedOracle.getDeployTransaction(
    baseSepoliaChainlinkConfig.router,
    baseSepoliaChainlinkConfig.donId,
    baseSepoliaChainlinkConfig.subscriptionId,
    baseSepoliaChainlinkConfig.gasLimit
  );
  const saltHash = ethers.keccak256(salt);
  const initCodeHash = ethers.keccak256(data);
  const computedAddress = await createX[
    "computeCreate2Address(bytes32,bytes32)"
  ](saltHash, initCodeHash);

  console.log("computedAddress:", computedAddress);
  await createX["deployCreate2(bytes32,bytes)"](nullBytes32, data).catch(() =>
    console.log("already deployed")
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
