import { expect } from "chai";
import hre from "hardhat";

describe("Contrato PlatformToken (ERC-20)", function () {
  let Token;
  let platformToken;
  let owner;
  let investidor;

  beforeEach(async function () {
    // Usamos hre.ethers agora
    [owner, investidor] = await hre.ethers.getSigners();

    Token = await hre.ethers.getContractFactory("PlatformToken");
    platformToken = await Token.deploy(owner.address);
  });

  describe("Configurações Iniciais", function () {
    it("Deve ter o nome e símbolo corretos", async function () {
      expect(await platformToken.name()).to.equal("PlatformToken");
      expect(await platformToken.symbol()).to.equal("PLT");
    });

    it("Deve atribuir o deployer como dono (owner) do contrato", async function () {
      expect(await platformToken.owner()).to.equal(owner.address);
    });
  });

  describe("Função de Mint", function () {
    it("O Dono deve conseguir mintar tokens para um investidor", async function () {
      const quantidade = hre.ethers.parseEther("100"); 
      
      await platformToken.mint(investidor.address, quantidade);

      expect(await platformToken.balanceOf(investidor.address)).to.equal(quantidade);
    });

    it("Deve falhar se alguém que não for o Dono tentar mintar", async function () {
      const quantidade = hre.ethers.parseEther("100");
      
      await expect(
        platformToken.connect(investidor).mint(investidor.address, quantidade)
      ).to.be.revertedWithCustomError(platformToken, "OwnableUnauthorizedAccount");
    });
  });
});