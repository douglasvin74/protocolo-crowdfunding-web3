// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CampaignNFT.sol";

contract CrowdfundingCore is ReentrancyGuard {
    AggregatorV3Interface internal priceFeed;
    CampaignNFT public nftContract;

    uint256 public goalUSD;
    uint256 public totalRaisedUSD;

    mapping(address => uint256) public contributionsUSD;

    /**
     * @param _nftAddress Endereço do contrato de recompensas
     * @param _priceFeedAddress Endereço do Oráculo da Chainlink (ETH/USD)
     * @param _goalUSD Meta da campanha em Dólares
     */
    constructor(address _nftAddress, address _priceFeedAddress, uint256 _goalUSD) {
        nftContract = CampaignNFT(_nftAddress);
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        goalUSD = _goalUSD * 1e18; // Ajustando para 18 casas decimais
    }

    // Consulta o Oráculo da Chainlink em tempo real
    function getLatestPrice() public view returns (uint256) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        
        // O preço do ETH/USD na Chainlink tem 8 decimais. Multiplicamos por 1e10 para igualar a 18.
        return uint256(price) * 1e10;
    }

    // Função de investimento na campanha
    function contribute() external payable nonReentrant {
        require(msg.value > 0, "A doacao deve ser maior que zero");

        uint256 ethPrice = getLatestPrice();
        
        // Calcula quanto vale o ETH enviado em USD
        uint256 contributionInUSD = (msg.value * ethPrice) / 1e18;

        contributionsUSD[msg.sender] += contributionInUSD;
        totalRaisedUSD += contributionInUSD;

        // Minta um NFT Nível Bronze (ID 1) automaticamente para o doador como recibo
        nftContract.mintReward(msg.sender, 1, 1);
    }
}