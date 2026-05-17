// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public immutable platformToken;

    // Mapeamento para rastrear quanto cada usuário depositou e quando
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public stakingStartTime;

    // Taxa de recompensa simplificada (ex: rende algumas frações por segundo)
    uint256 public rewardRate = 100; 

    constructor(address _tokenAddress) {
        platformToken = IERC20(_tokenAddress);
    }

    // Função para depositar tokens
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "A quantidade deve ser maior que zero");
        
        // Transfere do usuário para este contrato
        platformToken.transferFrom(msg.sender, address(this), amount);
        
        stakedBalances[msg.sender] += amount;
        stakingStartTime[msg.sender] = block.timestamp;
    }

    // Função para sacar tokens + recompensas
    function withdraw() external nonReentrant {
        uint256 staked = stakedBalances[msg.sender];
        require(staked > 0, "Nenhum token em stake");

        // Cálculo de recompensa baseado no tempo (block.timestamp)
        uint256 timeStaked = block.timestamp - stakingStartTime[msg.sender];
        uint256 reward = (staked * rewardRate * timeStaked) / 10000;

        // Zera o saldo do usuário ANTES de transferir (proteção extra contra reentrancy)
        stakedBalances[msg.sender] = 0;

        // Devolve o depósito original
        platformToken.transfer(msg.sender, staked);
        
        // Paga a recompensa (O contrato precisa ter saldo para pagar isso!)
        platformToken.transfer(msg.sender, reward);
    }
}