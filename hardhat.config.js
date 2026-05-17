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
       url: "SUA_URL_RPC",
       accounts: ["SUA_CHAVE_PRIVADA_META_MASK"]
     }
   }
};