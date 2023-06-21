const baseURL = 'https://dexback-dr7l.onrender.com/'//'http://127.0.0.1:3001/'
const inchURL = 'https://api.1inch.io/v5.0/'//1/approve/allowance?tokenAddress=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&walletAddress=0xA02B2223d1ee0584545ffc804c518693C1d76de0

const TokensConstData = [
      {
            "Chain": "ETH",
            "tokens": [
                  { SYM: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
                  { SYM: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
                  { SYM: "UNI", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" },
                  { SYM: "WXMR", address: "0x465e07d6028830124BE2E4aA551fBe12805dB0f5" }]
      },
      {
            "Chain": "BSC",
            "tokens": [
                  { SYM: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" },
                  { SYM: "USDT", address: "0x55d398326f99059ff775485246999027b3197955" },
                  { SYM: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82" },
                  { SYM: "WBNB", address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" },
                  { SYM: "BTCB", address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c" },
                  { SYM: "ETH", address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8" },
                  { SYM: "DOT", address: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402" },
                  { SYM: "UNI", address: "0xbf5140a22578168fd562dccf235e5d43a02ce9b1" },
                  { SYM: "LINK", address: "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd" },
                  { SYM: "DAI", address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3" },
                  { SYM: "ADA", address: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47" },
                  { SYM: "XRP", address: "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe" },
                  { SYM: "BCH", address: "0x8ff795a6f4d97e7887c79bea79aba5cc76444adf" },
                  { SYM: "EOS", address: "0x56b6fb708fc5732dec1afc8d8556423a2edccbd6" },
                  { SYM: "1INCH", address: "0x111111111117dc0aa78b770fa6a738034120c302" },

                  // { SYM: "WETH", address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
                  // { SYM: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
                  { SYM: "USDC", address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" }]
      },
      {
            "Chain": "TBSC",
            "tokens": [
                  { SYM: "BUSD", address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee" },
                  { SYM: "USDT", address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd" },
                  { SYM: "USDC", address: "0x64544969ed7EBf5f083679233325356EbE738930" }]
      }
]

const ERC20ABI = [
      {
            "anonymous": false,
            "inputs": [
                  {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                  },
                  {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                  },
                  {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                  }
            ],
            "name": "Approval",
            "type": "event"
      },
      {
            "anonymous": false,
            "inputs": [
                  {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                  },
                  {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                  },
                  {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                  }
            ],
            "name": "Transfer",
            "type": "event"
      },
      {
            "inputs": [
                  {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                  },
                  {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                  }
            ],
            "name": "allowance",
            "outputs": [
                  {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                  }
            ],
            "stateMutability": "view",
            "type": "function"
      },
      {
            "inputs": [
                  {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                  },
                  {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                  }
            ],
            "name": "approve",
            "outputs": [
                  {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                  }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
      },
      {
            "inputs": [
                  {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                  }
            ],
            "name": "balanceOf",
            "outputs": [
                  {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                  }
            ],
            "stateMutability": "view",
            "type": "function"
      },
      {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                  {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                  }
            ],
            "stateMutability": "view",
            "type": "function"
      },
      {
            "inputs": [
                  {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                  },
                  {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                  }
            ],
            "name": "transfer",
            "outputs": [
                  {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                  }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
      },
      {
            "inputs": [
                  {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                  },
                  {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                  },
                  {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                  }
            ],
            "name": "transferFrom",
            "outputs": [
                  {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                  }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
      }
]