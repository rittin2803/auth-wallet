import { ethers } from "hardhat";
import { deployedContractAddress } from "../deployedContractAddress";
import { entryPointAddress } from "../externalContractAddress";
import { endpointAddress } from "../layerZeroConfig";

async function main() {
  console.log("Deploying contracts...");

  // Use the specified account
  const deployer = new ethers.Wallet(
    process.env.PRIVATE_KEY || "",
    ethers.provider
  );
  const ownerAddress = deployer.address;
  console.log("Deploying contracts with account:", ownerAddress);

  // Deploy JWKSAutomatedOracle first
  console.log("\n1. Deploying JWKSAutomatedOracle...");
  const JWKSAutomatedOracle = await ethers.getContractFactory("JWKSAutomatedOracle", deployer);
  
  // Optimized constructor arguments for JWKSAutomatedOracle
  const router = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C"; // Base Sepolia Functions Router
  const donID = "0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000"; // Base Sepolia DON ID
  const subscriptionId = process.env.CHAINLINK_SUBSCRIPTION_ID || "4558"; // Your subscription ID
  const gasLimit = 200000; // Reduced gas limit
  
  const jwksOracle = await JWKSAutomatedOracle.deploy(
    router,
    donID,
    subscriptionId,
    gasLimit
  );
  await jwksOracle.waitForDeployment();
  const jwksOracleAddress = await jwksOracle.getAddress();
  console.log("JWKSAutomatedOracle deployed to:", jwksOracleAddress);

  // Deploy OmniExecutor
  console.log("\n2. Deploying OmniExecutor...");
  const OmniExecutor = await ethers.getContractFactory("OmniExecutor", deployer);
  
  const omniExecutor = await OmniExecutor.deploy(
    endpointAddress, // LayerZero endpoint from config
    ownerAddress // Owner address
  );
  await omniExecutor.waitForDeployment();
  const omniExecutorAddress = await omniExecutor.getAddress();
  console.log("OmniExecutor deployed to:", omniExecutorAddress);

  // Deploy AuthWalletFactory
  console.log("\n3. Deploying AuthWalletFactory...");
  const AuthWalletFactory = await ethers.getContractFactory("AuthWalletFactory", deployer);
  const authWalletFactory = await AuthWalletFactory.deploy(
    entryPointAddress, // EntryPoint address
    jwksOracleAddress, // JWKSAutomatedOracle address
    omniExecutorAddress // OmniExecutor address
  );
  await authWalletFactory.waitForDeployment();
  const authWalletFactoryAddress = await authWalletFactory.getAddress();
  console.log("AuthWalletFactory deployed to:", authWalletFactoryAddress);

  // Update deployedContractAddress.ts with new addresses
  console.log("\nUpdate the following addresses in contracts/deployedContractAddress.ts:");
  console.log(`OmniExecutor: "${omniExecutorAddress}"`);
  console.log(`JWKSAutomatedOracle: "${jwksOracleAddress}"`);
  console.log(`AuthWalletFactory: "${authWalletFactoryAddress}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });