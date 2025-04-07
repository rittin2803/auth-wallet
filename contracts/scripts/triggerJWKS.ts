import { ethers } from "hardhat";
import { JWKSAutomatedOracle } from "../abis/JWKSAutomatedOracle";
import { deployedContractAddress } from "../deployedContractAddress";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const jwksOracle = new ethers.Contract(
    deployedContractAddress.JWKSAutomatedOracle,
    JWKSAutomatedOracle,
    signer
  );

  console.log("Triggering JWKS data fetch...");
  const tx = await jwksOracle.performUpkeep("0x");
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Transaction confirmed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 