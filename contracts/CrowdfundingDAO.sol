// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract CrowdfundingDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    
    constructor(IVotes _token)
        Governor("CrowdfundingDAO")
        GovernorSettings(
            1,      // votingDelay: 1 bloco (permite votar logo após criar a proposta)
            100,    // votingPeriod: 100 blocos (duração da votação)
            0       // proposalThreshold: 0 (qualquer um com votos pode criar propostas)
        )
        GovernorVotes(_token)
    {}

    // As funções abaixo são exigidas pelo Solidity para resolver conflitos de herança do OpenZeppelin
    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 /* blockNumber */) public pure override returns (uint256) {
        return 1e18; 
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }
}