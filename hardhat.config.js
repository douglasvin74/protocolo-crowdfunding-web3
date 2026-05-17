import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun"
    }
  },
   networks: {
     sepolia: {
       url: "https://eth-sepolia.g.alchemy......",
       accounts: ["SUA_CHAVE_PRIVADA"]
     }
   }
};