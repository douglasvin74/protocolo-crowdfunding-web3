import { expect } from "chai";
import hre from "hardhat";

describe("Testes: Staking e DAO", function () {
  let platformToken, staking, dao;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await hre.ethers.getSigners();

    // 1. Deploy do Token
    const Token = await hre.ethers.getContractFactory("PlatformToken");
    platformToken = await Token.deploy(owner.address);

    // Mintando tokens para o usuário e ativando os votos!
    const userAmount = hre.ethers.parseEther("100");
    await platformToken.mint(user.address, userAmount);
    await platformToken.connect(user).delegate(user.address); // Delega votos para a DAO

    // 2. Deploy do Staking
    const Staking = await hre.ethers.getContractFactory("Staking");
    staking = await Staking.deploy(await platformToken.getAddress());
    
    // Abastecendo o Staking com recompensas (1000 tokens)
    await platformToken.mint(await staking.getAddress(), hre.ethers.parseEther("1000"));

    // 3. Deploy da DAO
    const DAO = await hre.ethers.getContractFactory("CrowdfundingDAO");
    dao = await DAO.deploy(await platformToken.getAddress());
  });

  it("Deve permitir fazer Staking de tokens", async function () {
    const stakeAmount = hre.ethers.parseEther("50");
    
    // Para depositar no staking, o usuário precisa 'Aprovar' o contrato primeiro
    await platformToken.connect(user).approve(await staking.getAddress(), stakeAmount);
    
    // Executa o Staking
    await staking.connect(user).stake(stakeAmount);

    const saldoStaking = await staking.stakedBalances(user.address);
    expect(saldoStaking).to.equal(stakeAmount);
  });

  it("Deve permitir a criação de uma Proposta na DAO", async function () {
    // A proposta será: transferir 0 ETH (apenas para teste de funcionamento)
    const targets = [owner.address];
    const values = [0];
    const calldatas = ["0x"];
    const description = "Proposta #1: Financiar Projeto Sustentável";

    // Usuário cria a proposta
    const tx = await dao.connect(user).propose(targets, values, calldatas, description);
    const receipt = await tx.wait();
    
    expect(receipt).to.not.be.undefined;
  });
});