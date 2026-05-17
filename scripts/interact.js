import hre from "hardhat";

async function main() {
  console.log("🌐 Iniciando a Integração Web3 com ethers.js...\n");

  // 1. Pegamos as contas de teste fornecidas pelo Hardhat
  const [owner, investidor] = await hre.ethers.getSigners();

  // 2. Simulamos o Deploy do contrato na rede (Testnet/Local)
  console.log("⏳ Fazendo o deploy do PlatformToken...");
  const Token = await hre.ethers.getContractFactory("PlatformToken");
  const platformToken = await Token.deploy(owner.address);
  await platformToken.waitForDeployment();

  const contractAddress = await platformToken.getAddress();
  console.log(`✅ Contrato implantado no endereço: ${contractAddress}\n`);

  // =========================================================
  // ETAPA 5.1 - Lendo dados (Simulando carregamento do Frontend)
  // =========================================================
  const nome = await platformToken.name();
  const simbolo = await platformToken.symbol();
  console.log(`📊 Informações do Token: ${nome} (${simbolo})`);

  // =========================================================
  // ETAPA 5.2 - Mint de Tokens (Simulando uma recompensa/compra)
  // =========================================================
  console.log(`\n⏳ Mintando 500 tokens para o Investidor (${investidor.address})...`);
  const quantidadeMint = hre.ethers.parseEther("500"); // Converte para 18 casas decimais
  
  const txMint = await platformToken.mint(investidor.address, quantidadeMint);
  await txMint.wait(); // Aguarda a transação ser minerada no bloco
  
  console.log("✅ Mint realizado com sucesso!");

  // =========================================================
  // ETAPA 5.3 - Interação de Governança (DAO - ERC20Votes)
  // =========================================================
  console.log(`\n⏳ Delegando poder de voto para o próprio investidor...`);
  // Para que o saldo conte como "poder de voto" na DAO, o usuário precisa delegar a si mesmo
  const txDelegate = await platformToken.connect(investidor).delegate(investidor.address);
  await txDelegate.wait();
  
  console.log("✅ Votos delegados com sucesso para a DAO!");

  // =========================================================
  // ETAPA 5.4 - Consultando os resultados finais
  // =========================================================
  const saldo = await platformToken.balanceOf(investidor.address);
  const poderDeVoto = await platformToken.getVotes(investidor.address);

  console.log(`\n💰 Saldo Final do Investidor: ${hre.ethers.formatEther(saldo)} ${simbolo}`);
  console.log(`🗳️ Poder de Voto na DAO: ${hre.ethers.formatEther(poderDeVoto)} votos`);
}

// Padrão recomendado para usar async/await em scripts Node
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});