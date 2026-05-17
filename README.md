
## 👤 Autor e Identificação

* **Autor:** Douglas Prado
* **Curso:** Web 3.0 — U1C501T1
* **Contexto:** Produto Mínimo Viável (MVP) de ecossistema descentralizado de financiamento coletivo com mitigação de volatilidade e governança integrada.

---

## 📖 Sobre o Projeto

O desenvolvimento de projetos físicos frequentemente esbarra na alta volatilidade do mercado de criptomoedas, o que pode comprometer o orçamento e a execução do plano de negócios entre o período de arrecadação e a entrega real. 

Este **MVP (Minimum Viable Product)** soluciona esse problema criando um ecossistema de financiamento coletivo (*Crowdfunding*) imune à volatilidade imediata dos criptoativos ativos:
* **Indexação em Dólar (USD):** Utiliza **Oráculos (Chainlink)** para consultar os preços em tempo real e travar a meta em USD, protegendo os criadores contra desvalorizações súbitas.
* **Incentivos Web3:** Recompensa os investidores com **NFTs dinâmicos/em tiers** e distribui direitos de **governança** sobre os fundos e rumos da plataforma.

---

## 🏗️ Arquitetura dos Contratos

O protocolo é modular e composto por 4 contratos inteligentes (*Smart Contracts*) principais, integrados para garantir utilidade, governança e segurança:

| Contrato | Padrão / Base | Função Principal |
| :--- | :--- | :--- |
| **`PlatformToken`** | `ERC-20` | Token nativo (**PLT**) de utilidade e poder de voto. Implementa `ERC20Votes` e `ERC20Permit` para viabilizar assinaturas *gasless* e delegação de votos. |
| **`CampaignNFT`** | `ERC-1155` | Recibos de doação e tokens de recompensa multifuncionais divididos em múltiplos níveis (*Tiers*: Bronze, Silver, Gold). |
| **`Staking`** | `ReentrancyGuard` | Contrato de retenção de liquidez que recompensa investidores engajados com rendimentos (*yield*) baseados no tempo real decorrido (`block.timestamp`). |
| **`CrowdfundingDAO`** | `Governor` | Governança descentralizada baseada em *OpenZeppelin Governor*. Os detentores do token **PLT** decidem o rumo da plataforma de forma automatizada, transparente e 100% *on-chain*. |

---

## 🛡️ Segurança e Auditoria

O protocolo foi projetado sob rígidos critérios de segurança de contratos inteligentes:

* **Prevenção contra Reentrância:** Utilização do modificador `nonReentrant` através do `ReentrancyGuard` da OpenZeppelin no contrato de Staking.
* **Aritmética Segura:** Proteção nativa contra *Underflow* e *Overflow* assegurada pelo compilador do `Solidity ^0.8.28`.
* **Testes Unitários:** Cobertura robusta e **100% de aprovação** nos testes de comportamento e estado usando Mocha/Chai sob o ambiente Hardhat.
* **Análise Estática (Slither):** Varredura completa do código fonte sem nenhuma vulnerabilidade de nível *High* ou *Critical* detectada.

---

## ⚙️ Como Executar o Projeto Localmente

### 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* Uma conta no [Alchemy](https://www.alchemy.com/) ou [Infura](https://www.infura.io/) para obter uma URL de RPC.
* Uma carteira [MetaMask](https://metamask.io/) configurada com saldo (test tokens) na rede **Sepolia Testnet**.

### 🛠️ Passo a Passo

#### 1. Clonar o Repositório e Instalar as Dependências

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd protocolo-tic29
npm install
```

#### 2. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto contendo as suas credenciais. **Atenção:** Nunca envie ou faça *commit* deste arquivo para repositórios públicos.

```env
SEPOLIA_URL="sua_url_do_alchemy_aqui"
PRIVATE_KEY="sua_chave_privada_da_metamask_aqui"
```

#### 3. Compilar e Executar Testes Locais

Garanta que todos os testes passem com sucesso no ambiente local integrado do Hardhat:

```bash
# Compilar os smart contracts
npx hardhat compile

# Executar a suíte de testes unitários
npx hardhat test
```

#### 4. Realizar Análise Estática de Segurança (Opcional)

Para validar a integridade dos contratos com o **Slither**, certifique-se de possuir o Python e a biblioteca instalados globalmente:

```bash
python -m slither .
```

#### 5. Realizar o Deploy na Sepolia Testnet

Execute os scripts para verificar a saúde do saldo da conta e, em seguida, efetuar a publicação na rede de testes:

```bash
# Verificar se há saldo suficiente para o Gas Fee
npx hardhat run scripts/checkBalance.js --network sepolia

# Executar o script de implantação (Deploy)
npx hardhat run scripts/deploy.js --network sepolia
```

#### 6. Interação Web3 (Simulação de Frontend)

Você pode simular as interações básicas e transações com a rede através do script automatizado:

```bash
npx hardhat run scripts/interact.js --network sepolia
```
README.md
