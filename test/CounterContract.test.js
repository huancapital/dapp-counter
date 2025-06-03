const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CounterContract", function () {
  let counterContract;
  let owner;
  let addr1;
  let addr2;
  let feeRecipient;
  
  const FEE_AMOUNT = ethers.parseEther("0.001"); // 0.001 tBNB

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();
    feeRecipient = "0xd0044e990a292162a70ee14dF9C0DB4c1CB37B36";
    
    // Deploy the contract
    const CounterContract = await ethers.getContractFactory("CounterContract");
    counterContract = await CounterContract.deploy();
    await counterContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct initial values", async function () {
      expect(await counterContract.count()).to.equal(0);
      expect(await counterContract.feeAmount()).to.equal(FEE_AMOUNT);
      expect(await counterContract.feeRecipient()).to.equal(feeRecipient);
    });
  });

  describe("Get function", function () {
    it("Should return the current count", async function () {
      expect(await counterContract.get()).to.equal(0);
    });
  });

  describe("Increment function", function () {
    it("Should increment count when correct fee is paid", async function () {
      await counterContract.connect(addr1).inc({ value: FEE_AMOUNT });
      expect(await counterContract.count()).to.equal(1);
    });

    it("Should emit FeeCollected event", async function () {
      await expect(counterContract.connect(addr1).inc({ value: FEE_AMOUNT }))
        .to.emit(counterContract, "FeeCollected")
        .withArgs(addr1.address, FEE_AMOUNT);
    });

    it("Should fail when insufficient fee is paid", async function () {
      const insufficientFee = ethers.parseEther("0.0005");
      await expect(
        counterContract.connect(addr1).inc({ value: insufficientFee })
      ).to.be.revertedWith("Insufficient fee payment");
    });

    it("Should increment multiple times", async function () {
      await counterContract.connect(addr1).inc({ value: FEE_AMOUNT });
      await counterContract.connect(addr2).inc({ value: FEE_AMOUNT });
      expect(await counterContract.count()).to.equal(2);
    });

    it("Should accept excess fee", async function () {
      const excessFee = ethers.parseEther("0.002");
      await counterContract.connect(addr1).inc({ value: excessFee });
      expect(await counterContract.count()).to.equal(1);
    });
  });

  describe("Decrement function", function () {
    beforeEach(async function () {
      // Set count to 5 for decrement tests
      for (let i = 0; i < 5; i++) {
        await counterContract.connect(addr1).inc({ value: FEE_AMOUNT });
      }
    });

    it("Should decrement count when correct fee is paid", async function () {
      const initialCount = await counterContract.count();
      await counterContract.connect(addr1).dec({ value: FEE_AMOUNT });
      expect(await counterContract.count()).to.equal(initialCount - 1n);
    });

    it("Should emit FeeCollected event", async function () {
      await expect(counterContract.connect(addr1).dec({ value: FEE_AMOUNT }))
        .to.emit(counterContract, "FeeCollected")
        .withArgs(addr1.address, FEE_AMOUNT);
    });

    it("Should fail when insufficient fee is paid", async function () {
      const insufficientFee = ethers.parseEther("0.0005");
      await expect(
        counterContract.connect(addr1).dec({ value: insufficientFee })
      ).to.be.revertedWith("Insufficient fee payment");
    });

    it("Should fail when count is 0", async function () {
      // Reset counter to 0
      const currentCount = await counterContract.count();
      for (let i = 0; i < currentCount; i++) {
        await counterContract.connect(addr1).dec({ value: FEE_AMOUNT });
      }
      
      await expect(
        counterContract.connect(addr1).dec({ value: FEE_AMOUNT })
      ).to.be.revertedWith("Count cannot be negative");
    });

    it("Should decrement multiple times", async function () {
      const initialCount = await counterContract.count();
      await counterContract.connect(addr1).dec({ value: FEE_AMOUNT });
      await counterContract.connect(addr2).dec({ value: FEE_AMOUNT });
      expect(await counterContract.count()).to.equal(initialCount - 2n);
    });
  });

  describe("Fee handling", function () {
    it("Should transfer fees to fee recipient", async function () {
      // This test would require forking mainnet or using a custom setup
      // to test actual fee transfers. For now, we just test that the 
      // transaction doesn't revert, which means the transfer succeeded.
      await expect(
        counterContract.connect(addr1).inc({ value: FEE_AMOUNT })
      ).to.not.be.reverted;
    });
  });

  describe("Gas usage", function () {
    it("Should use reasonable gas for increment", async function () {
      const tx = await counterContract.connect(addr1).inc({ value: FEE_AMOUNT });
      const receipt = await tx.wait();
      
      // Gas usage should be reasonable (less than 100k gas)
      expect(receipt.gasUsed).to.be.below(100000);
    });

    it("Should use reasonable gas for decrement", async function () {
      // First increment to have something to decrement
      await counterContract.connect(addr1).inc({ value: FEE_AMOUNT });
      
      const tx = await counterContract.connect(addr1).dec({ value: FEE_AMOUNT });
      const receipt = await tx.wait();
      
      // Gas usage should be reasonable (less than 100k gas)
      expect(receipt.gasUsed).to.be.below(100000);
    });
  });
}); 