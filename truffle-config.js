// const HDWalletProvider = require('truffle-hdwallet-provider');
// require('dotenv').config();

module.exports = {

  networks: {

    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
/*   rinkeby: {
    provider: function() {
      return new HDWalletProvider("rastic dinosaur steak casino enlist theme brick zero spatial tonight original orange","https://rinkeby.infura.io/v3/dc97f8759b8f4b5d97551d46aa132fb9");
      },
    gas: 5000000,
    gasPrice: 40000000000,
    network_id: 4
    }, */
    /*  // main ethereum network(mainnet)
    main: {
      provider: () => new HDWalletProvider(process.env.MAINMNENOMIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    } 
  },
 */
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "byzantium"
      }
    }
  }
}}
