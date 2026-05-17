import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🚀 Iniciando o deploy com a conta: ${deployer.address}`);

  // 1. Deploy do Token ERC-20
  console.log("\n⏳ Fazendo deploy do PlatformToken...");
  const Token = await hre.ethers.getContractFactory("PlatformToken");
  const platformToken = await Token.deploy(deployer.address);
  await platformToken.waitForDeployment();
  const tokenAddress = await platformToken.getAddress();
  console.log(`✅ PlatformToken implantado em: ${tokenAddress}`);

  // 2. Deploy do NFT ERC-1155
  console.log("\n⏳ Fazendo deploy do CampaignNFT...");
  const baseURI = "ipfs://QMSuaHashIPFSAqui/"; // Pode deixar esse link de exemplo para o MVP
  const NFT = await hre.ethers.getContractFactory("CampaignNFT");
  const campaignNFT = await NFT.deploy(deployer.address, baseURI);
  await campaignNFT.waitForDeployment();
  const nftAddress = await campaignNFT.getAddress();
  console.log(`✅ CampaignNFT implantado em: ${nftAddress}`);

  // 3. Deploy do Staking
  console.log("\n⏳ Fazendo deploy do Staking...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log(`✅ Staking implantado em: ${stakingAddress}`);

  // 4. Deploy da DAO
  console.log("\n⏳ Fazendo deploy da CrowdfundingDAO...");
  const DAO = await hre.ethers.getContractFactory("CrowdfundingDAO");
  const dao = await DAO.deploy(tokenAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log(`✅ CrowdfundingDAO implantado em: ${daoAddress}`);

  console.log("\n🎉 DEPLOY CONCLUÍDO COM SUCESSO! 🎉");
  console.log("Copie os endereços acima para o seu relatório da Etapa 6.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});