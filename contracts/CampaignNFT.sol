// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CampaignNFT is ERC1155, Ownable {
    using Strings for uint256;

    // Nome e símbolo para plataformas como OpenSea reconhecerem a coleção
    string public name = "Crowdfunding Rewards";
    string public symbol = "CRWD-NFT";

    // Definindo os IDs dos Níveis (Tiers) de recompensa do Crowdfunding
    uint256 public constant TIER_BRONZE = 1;
    uint256 public constant TIER_SILVER = 2;
    uint256 public constant TIER_GOLD = 3;

    /**
     * @dev O construtor recebe o endereço do dono e o link base dos metadados (IPFS).
     * O formato do baseURI geralmente é: "ipfs://SEU_CID_AQUI/"
     */
    constructor(address initialOwner, string memory baseURI) 
        ERC1155(baseURI) 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Função para o protocolo (ou dono) mintar o NFT de recompensa para o investidor.
     * @param account Endereço do investidor
     * @param id O ID do Tier (ex: 1 para BRONZE, 2 para SILVER)
     * @param amount A quantidade de NFTs desse ID (geralmente 1 por doação)
     */
    function mintReward(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    /**
     * @dev Função para mintar várias recompensas diferentes de uma vez (Mint em Lote).
     */
    function mintBatchRewards(address to, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }

    /**
     * @dev Permite atualizar o URI base caso os metadados da campanha mudem.
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev Sobrescreve a função uri nativa para retornar o link no formato correto: {baseURI}{id}.json
     * Isso garante que os metadados funcionem perfeitamente em marketplaces e carteiras.
     */
    function uri(uint256 _tokenid) public view override returns (string memory) {
        string memory baseURI = super.uri(0);
        return string(abi.encodePacked(baseURI, _tokenid.toString(), ".json"));
    }
}