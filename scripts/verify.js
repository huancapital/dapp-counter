const hre = require("hardhat");

async function main() {
  // Replace with your deployed contract address
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.log("❌ Please provide the contract address as an argument");
    console.log("Usage: npx hardhat run scripts/verify.js --network bscTestnet <CONTRACT_ADDRESS>");
    process.exit(1);
  }
  
  console.log("🔍 Verifying CounterContract on BSCScan...");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  
  try {
    // Verify the contract
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // CounterContract has no constructor arguments
      contract: "contracts/CounterContract.sol:CounterContract"
    });
    
    console.log("✅ Contract verified successfully!");
    console.log("🔗 View verified contract:", `https://testnet.bscscan.com/address/${contractAddress}#code`);
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract is already verified!");
      console.log("🔗 View verified contract:", `https://testnet.bscscan.com/address/${contractAddress}#code`);
    } else {
      console.error("❌ Verification failed:");
      console.error(error.message);
      
      // Common troubleshooting tips
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure BSCSCAN_API_KEY is set in your .env file");
      console.log("2. Wait a few minutes after deployment before verifying");
      console.log("3. Ensure the contract address is correct");
      console.log("4. Check that the contract was compiled with the same Solidity version");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 