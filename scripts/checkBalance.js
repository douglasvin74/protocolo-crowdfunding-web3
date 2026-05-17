import hre from "hardhat";

async function main() {
  console.log("🌐 Testando conexão com a rede Sepolia...");

  // Puxa a conta usando a chave privada que você colocou no hardhat.config.js
  const [deployer] = await hre.ethers.getSigners();
  
  // Puxa informações da rede via Alchemy
  const network = await hre.ethers.provider.getNetwork();
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  
  // Puxa o saldo da carteira
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("\n✅ CONEXÃO BEM-SUCEDIDA!");
  console.log("-------------------------------------------------");
  console.log(`📡 Rede Conectada: ${network.name}`);
  console.log(`📦 Bloco Atual: ${blockNumber}`);
  console.log(`👛 Endereço da Carteira: ${deployer.address}`);
  console.log(`💰 Saldo Disponível: ${hre.ethers.formatEther(balance)} SepoliaETH`);
  console.log("-------------------------------------------------\n");
  
  if (balance > 0) {
    console.log("🚀 Tudo pronto! Você já pode rodar o script de deploy.");
  } else {
    console.log("⚠️ Seu saldo é zero. Você precisa de SepoliaETH para o deploy.");
  }
}

main().catch((error) => {
  console.error("\n❌ ERRO NA CONEXÃO. Verifique sua URL ou Chave Privada.");
  console.error(error.message);
  process.exitCode = 1;
});