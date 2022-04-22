const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("WavePortal", function () {
  let wavePortalContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  it("should deploy WavePortal", async function () {
    const WavePortalContract = await ethers.getContractFactory("WavePortal");

    wavePortalContract = await WavePortalContract.deploy();
  });

  describe("getAllWaves()", function () {
    it("should return the number of waves", async function () {
      expect(await wavePortalContract.getTotalWaves()).to.equal(0);
    });
  });

  describe("wave(message)", () => {
    it("should increment number of waves", async () => {
      await wavePortalContract.wave("hi");
      expect(await wavePortalContract.getTotalWaves()).to.equal(1);
    });
    it("should emit NewWaveReceived event", async () => {
      const [owner] = await ethers.getSigners();
      expect(await wavePortalContract.wave("hello"))
        .to.emit(wavePortalContract, "NewWaveReceived")
        .withArgs(
          owner.address,
          (await ethers.provider.getBlock("latest")).timestamp,
          "hello"
        );
    });
  });
});
