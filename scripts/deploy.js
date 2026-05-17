import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🚀 Iniciando o deploy com a conta: ${deployer.address}\n`);

  // ==========================================
  // 1. Deploy do Token ERC-20
  // ==========================================
  console.log("⏳ [1/5] Preparando deploy do PlatformToken...");
  const Token = await hre.ethers.getContractFactory("PlatformToken");
  const platformToken = await Token.deploy(deployer.address);
  
  console.log(`   ➡️ Transação enviada! Hash: ${platformToken.deploymentTransaction().hash}`);
  console.log(`   ⏳ Aguardando mineração do bloco...`);
  await platformToken.waitForDeployment();
  
  const tokenAddress = await platformToken.getAddress();
  console.log(`✅ PlatformToken implantado em: ${tokenAddress}\n`);


  // ==========================================
  // 2. Deploy do NFT ERC-1155
  // ==========================================
  console.log("⏳ [2/5] Preparando deploy do CampaignNFT...");
  const baseURI = "ipfs://QMSuaHashIPFSAqui/"; 
  const NFT = await hre.ethers.getContractFactory("CampaignNFT");
  const campaignNFT = await NFT.deploy(deployer.address, baseURI);
  
  console.log(`   ➡️ Transação enviada! Hash: ${campaignNFT.deploymentTransaction().hash}`);
  console.log(`   ⏳ Aguardando mineração do bloco...`);
  await campaignNFT.waitForDeployment();
  
  const nftAddress = await campaignNFT.getAddress();
  console.log(`✅ CampaignNFT implantado em: ${nftAddress}\n`);


  // ==========================================
  // 3. Deploy do Crowdfunding Core
  // ==========================================
  console.log("⏳ [3/5] Preparando deploy do CrowdfundingCore (Oráculo Chainlink)...");
  const sepoliaEthUsdFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  const metaDaCampanhaEmDolar = 10000; 
  
  const Core = await hre.ethers.getContractFactory("CrowdfundingCore");
  const core = await Core.deploy(nftAddress, sepoliaEthUsdFeed, metaDaCampanhaEmDolar);
  
  console.log(`   ➡️ Transação enviada! Hash: ${core.deploymentTransaction().hash}`);
  console.log(`   ⏳ Aguardando mineração do bloco...`);
  await core.waitForDeployment();
  
  const coreAddress = await core.getAddress();
  console.log(`✅ CrowdfundingCore implantado em: ${coreAddress}\n`);


  // ==========================================
  // 3.1 Transferência de Propriedade
  // ==========================================
  console.log("🔄 Concedendo permissão de mint do NFT para o contrato Core...");
  const txOwnership = await campaignNFT.transferOwnership(coreAddress);
  console.log(`   ➡️ Transação de permissão enviada! Hash: ${txOwnership.hash}`);
  console.log(`   ⏳ Aguardando confirmação...`);
  await txOwnership.wait();
  console.log(`✅ Permissão concedida com sucesso!\n`);


  // ==========================================
  // 4. Deploy do Staking
  // ==========================================
  console.log("⏳ [4/5] Preparando deploy do Staking...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  
  console.log(`   ➡️ Transação enviada! Hash: ${staking.deploymentTransaction().hash}`);
  console.log(`   ⏳ Aguardando mineração do bloco...`);
  await staking.waitForDeployment();
  
  const stakingAddress = await staking.getAddress();
  console.log(`✅ Staking implantado em: ${stakingAddress}\n`);


  // ==========================================
  // 5. Deploy da DAO
  // ==========================================
  console.log("⏳ [5/5] Preparando deploy da CrowdfundingDAO...");
  const DAO = await hre.ethers.getContractFactory("CrowdfundingDAO");
  const dao = await DAO.deploy(tokenAddress);
  
  console.log(`   ➡️ Transação enviada! Hash: ${dao.deploymentTransaction().hash}`);
  console.log(`   ⏳ Aguardando mineração do bloco...`);
  await dao.waitForDeployment();
  
  const daoAddress = await dao.getAddress();
  console.log(`✅ CrowdfundingDAO implantado em: ${daoAddress}\n`);


  console.log("🎉 DEPLOY COMPLETO CONCLUÍDO COM SUCESSO! 🎉");
  console.log("Copie os endereços acima para o seu relatório da Etapa 6.");
}

main().catch((error) => {
  console.error("\n❌ Ocorreu um erro durante o deploy:");
  console.error(error);
  process.exitCode = 1;
});