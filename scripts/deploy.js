const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of CounterContract to BSC Testnet...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "BNB");
  
  if (balance < hre.ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance. Make sure you have enough tBNB for deployment and gas fees.");
    console.log("🔗 Get testnet BNB from: https://testnet.bnbchain.org/faucet-smart");
  }

  console.log("\n📦 Deploying CounterContract...");
  
  // Get the contract factory
  const CounterContract = await hre.ethers.getContractFactory("CounterContract");
  
  // Deploy the contract
  const counter = await CounterContract.deploy();
  
  // Wait for deployment to be mined
  await counter.waitForDeployment();
  
  const contractAddress = await counter.getAddress();
  
  console.log("✅ CounterContract deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 View on BSCScan:", `https://testnet.bscscan.com/address/${contractAddress}`);
  
  // Get deployment transaction
  const deploymentTx = counter.deploymentTransaction();
  if (deploymentTx) {
    console.log("📋 Deployment transaction hash:", deploymentTx.hash);
    console.log("🔗 View transaction:", `https://testnet.bscscan.com/tx/${deploymentTx.hash}`);
  }
  
  // Display contract info
  console.log("\n📊 Contract Information:");
  console.log("- Fee Amount:", hre.ethers.formatEther(await counter.feeAmount()), "tBNB");
  console.log("- Fee Recipient:", await counter.feeRecipient());
  console.log("- Initial Count:", (await counter.count()).toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "CounterContract",
    contractAddress: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    deploymentTx: deploymentTx?.hash,
    timestamp: new Date().toISOString(),
    feeAmount: hre.ethers.formatEther(await counter.feeAmount()),
    feeRecipient: await counter.feeRecipient()
  };
  
  console.log("\n💾 Deployment completed successfully!");
  console.log("🔧 To verify the contract, run:");
  console.log(`npx hardhat verify --network bscTestnet ${contractAddress}`);
  
  return deploymentInfo;
}

// Execute deployment
main()
  .then((deploymentInfo) => {
    console.log("\n🎉 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }); 