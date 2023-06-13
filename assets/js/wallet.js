var provider, signer, MyWalletAddress
var wNames = new Array();
var BUSD = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'

function ca(cc) {
      allowance(BUSD, MyWalletAddress, cc).then((r) => {
            console.info(r)
            console.log(Number(r._hex))
      })
}

function checkForWallet() {
      if (window.ethereum) {
            window.ethereum.enable()
            console.info(window.ethereum)
            /*
                        var allWalls = window.ethereum.providers
                        console.info(allWalls)
                        for (let i = 0; i < allWalls.length; i++) {
                              const element = allWalls[i];
                              var pname = '';
                              if (element.isMetaMask) {
                                    pname = { name: 'Metamask', sym: 'm', index: i }
                              }
                              if (element.isCoinbaseWallet) {
                                    pname = { name: 'Coinbase', sym: 'c', index: i }
                              }
                              if (element.isTrustWallet) {
                                    pname = { name: 'TrustWallet', sym: 't', index: i }
                              }
                              wNames[i] = pname;
                        }*/
            //window.ethereum.enable(ethereum.providers[0])
            // const accounts = ethereum.request({ method: 'eth_requestAccounts' }).then((res) => {
            //       console.info(res)

            // });




            //console.info(wNames)
            provider = new ethers.providers.Web3Provider(window.ethereum)
            console.info(provider)
            signer = provider.getSigner()
            console.info(signer)
            signer.getAddress().then((res) => {
                  MyWalletAddress = res
            })

            // chechAllowance(BUSD, '0x11677b07C9AcA203A9131571a164C3F0d3f31908', '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458').then((res) => {
            //       console.info(res)
            //       allowance = Number(res._hex)
            // })



      } else {
            window.alert('Wallet not faound.')
      }
}

var allowanceAmount = 0;

async function allowance(contractAddress, ownerAddress, spenderAddress) {
      var Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
      return await Contract.allowance(ownerAddress, spenderAddress)
}

async function approve(contractAddress, spenderAddress, amount) {
      console.log("Approv req: amount: " + amount + '   spender: ' + spenderAddress + '   contract: ' + contractAddress)
      var Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
      return await Contract.approve(spenderAddress, ethers.BigNumber.from(amount))
}