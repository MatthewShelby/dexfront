// Currently Selected Chain
var selectedChain = 'ETH'

// Info of tokens avaliable on the selected chain.  array of objects
var chainTokens = new Array();

// Operator contract
var spenderAddress

var payTokenPrice, receiveTokenPrice, isPriceFetched, isPayPriceFetched, isReceivePriceFetched

var payTokenDecimals, receiveTokenDecimals


var currentPayToken = ''
var currentReceiveToken = ''
var isFirstPaySet = true;
var isFirstReceiveSet = true;



function setChainTokns() {
      console.log('setChainTokns => Start')

      for (let i = 0; i < TokensConstData.length; i++) {
            const element = TokensConstData[i];
            if (element.Chain == selectedChain) {
                  chainTokens = element.tokens;
            }
      }
      setPayDropdown()
      setReceiveDropdown()
}

function setPayDropdown() {
      console.log('setPayDropdown => Start')
      var menuItems = '';
      for (let i = 0; i < chainTokens.length; i++) {
            var inp = chainTokens[i]
            var mSYM = inp.SYM
            if (mSYM == 'UNI') {
                  mSYM = '&nbsp;UNI&nbsp;&nbsp; '
            }

            if (isFirstPaySet && i == 0) {
                  payTokenSelect(inp.SYM)
                  isFirstPaySet = false
                  console.log('defult pay set to: ' + inp.SYM)
            }
            else if (inp.SYM !== currentReceiveToken && inp.SYM !== currentPayToken) {
                  menuItems += ` <span class="tokenListOpt" onclick="payTokenSelect('${inp.SYM}')">
                                          <img src="assets/images/coin/${inp.SYM}.png" class="menuImg" alt="">
                                          <span>${mSYM}</span>
                                    </span>`
            }
      }
      document.getElementById('payDropdown').innerHTML = menuItems;
}

function setReceiveDropdown() {
      var menuItems = '';
      for (let i = 0; i < chainTokens.length; i++) {
            var inp = chainTokens[i]
            var mSYM = inp.SYM
            if (mSYM == 'UNI') {
                  mSYM = '&nbsp;UNI&nbsp;&nbsp; '
            }
            if (i == 1 && isFirstReceiveSet) {
                  receiveTokenSelect(inp.SYM)
                  isFirstReceiveSet = false
            }
            else if (inp.SYM !== currentReceiveToken && inp.SYM !== currentPayToken) {
                  menuItems += ` <span class="tokenListOpt" onclick="receiveTokenSelect('${inp.SYM}')">
                                          <img src="assets/images/coin/${inp.SYM}.png" class="menuImg" alt="">
                                          <span>${mSYM}</span>
                                    </span>`
            }
      }
      document.getElementById('receiveDropdown').innerHTML = menuItems;
}



function afterPriceCame() {
      console.log('After Called p: ' + isPayPriceFetched + '    res: ' + isReceivePriceFetched)
      if (isPayPriceFetched && isReceivePriceFetched) {
            //setPrices()
            document.getElementById('payTokenInput').addEventListener('input', setPayAmount)
            document.getElementById('receiveTokenInput').addEventListener('input', setReceiveAmount)
            setPayAmount()
            waitingOff()
            isPriceFetched = true
      }
}

function getPrice(tAddress, isFor) {
      if (isFor == 'pay') {
            isPayPriceFetched = false
      }
      if (isFor == 'receive') {
            isReceivePriceFetched = false
      }

      console.log('isFor: ' + isFor)
      jQuery.ajax({
            url: `${baseURL}getTokenPrice?address=${tAddress}&chain=${selectedChain}`,
            type: 'get',
            success: function (res) {
                  console.info(res)
                  console.log('currentPayToken: ' + currentPayToken + '   -currentReceiveToken: ' + currentReceiveToken)
                  if (isFor == 'pay') {
                        payTokenPrice = res.data.usdPrice
                        isPayPriceFetched = true
                        payTokenDecimals = Number(res.data.tokenDecimals)
                        checkAllowance(getAddressBySymbol(currentPayToken), MyWalletAddress, payTokenDecimals, currentPayToken);
                        // LogFor

                  }
                  if (isFor == 'receive') {
                        receiveTokenPrice = res.data.usdPrice
                        isReceivePriceFetched = true
                        receiveTokenDecimals = Number(res.data.tokenDecimals)

                        console.log(' Receive Price for ' + res.data.tokenSymbol + 'has been set to: ' + receiveTokenPrice)
                        console.log('MyWalletAddress' + MyWalletAddress)
                        /*.then((res) => {
                              console.log('The Allowance: ' + Number(res._hex))
                        })//HERE/*/

                  }
                  var info = {
                        tAddress: tAddress,
                        selectedChain: selectedChain,
                        symbol: res.data.tokenSymbol,
                        callResult: res
                  }
                  recordInfo('For_' + isFor, 'Get_Price', info)
                  afterPriceCame()
            },
            error: function (res) {
                  console.log('Error =>')
                  console.info(res)
                  console.log('Errored address: ' + tAddress)
                  errored('unknown')
            }
      })
}

function errored(er) {
      waitingOff()
      window.alert('Operation failed with error: \n' + er + '\nPlease reload the page using Ctrl + Shift + R \nor contact support.')
}

function setReceiveAmount() {
      var payInp = document.getElementById('receiveTokenInput').value;
      if (payInp != '' && isPriceFetched) {
            console.log('payInp: ' + payInp + '   -payTokenPrice: ' + payTokenPrice + '   -receiveTokenPrice: ' + receiveTokenPrice)
            payInp = Number(payInp)
            var receiveMount = payInp * receiveTokenPrice / payTokenPrice
            document.getElementById('payTokenInput').value = receiveMount
            //console.log(receiveMount)
      }
}

function setPayAmount() {
      var payInp = document.getElementById('payTokenInput').value;
      if (payInp != '' && isPriceFetched) {
            console.log('payInp: ' + payInp + '   -payTokenPrice: ' + payTokenPrice + '   -receiveTokenPrice: ' + receiveTokenPrice)
            payInp = Number(payInp)
            var receiveMount = payInp * payTokenPrice / receiveTokenPrice
            document.getElementById('receiveTokenInput').value = receiveMount
            //document.getElementById('payTokenInput').style.border = 'none';

            //console.log(receiveMount)
            if (payInp > allowanceAmount) {
                  document.getElementById('swapBtn').disabled = true;

            } else {
                  document.getElementById('swapBtn').disabled = false;
            }
      }
}








function getAddressBySymbol(sym) {
      console.log('getAddressBySymbol => Start')
      for (let i = 0; i < TokensConstData.length; i++) {
            const element = TokensConstData[i];
            if (element.Chain == selectedChain) {
                  for (let j = 0; j < element.tokens.length; j++) {
                        const ele = element.tokens[j];
                        if (ele.SYM == sym) {
                              return ele.address
                        }
                  }
            }
      }
}

function payTokenSelect(inp) {
      waitingOn()
      console.log('call for payTokenSelect: ' + inp)
      document.getElementById('payTokenName').innerHTML = inp;
      document.getElementById('payTokenImg').src = `./assets/images/coin/${inp}.png`
      currentPayToken = inp
      if (!isFirstPaySet) {
            setPayDropdown()
            setReceiveDropdown()
      }
      getPrice(getAddressBySymbol(inp), 'pay')
}

function receiveTokenSelect(inp) {
      waitingOn()
      console.log('call for receiveTokenSelect' + inp)

      document.getElementById('receiveTokenName').innerHTML = inp;
      document.getElementById('receiveTokenImg').src = `./assets/images/coin/${inp}.png`
      currentReceiveToken = inp
      if (!isFirstReceiveSet) {
            setPayDropdown()
            setReceiveDropdown()
      }
      getPrice(getAddressBySymbol(inp), 'receive')//isPayPriceFetched
}




var firstPayFocus = true;
var firstReceiveFocus = true;
document.getElementById('payTokenInput').addEventListener('focus', () => {
      if (firstPayFocus) {
            document.getElementById('payTokenInput').value = '';
            firstPayFocus = false
            firstReceiveFocus = false
      }
      else {
            document.getElementById('payTokenInput').select();
      }
})
document.getElementById('receiveTokenInput').addEventListener('focus', () => {
      if (firstReceiveFocus) {
            document.getElementById('receiveTokenInput').value = '';
            firstReceiveFocus = false
            firstPayFocus = false
      } else {
            document.getElementById('receiveTokenInput').select();
      }
})

//#region SELECT CHAIN and TOKEN selectoer open BUTTONS

function openChainSelect() {
      setTimeout(() => {
            document.getElementById("myDropdown").classList.toggle("show");
      }, 100);
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
      if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                  var openDropdown = dropdowns[i];
                  if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                  }
            }
      }
}

function resetFormState() {
      isFirstPaySet = true
      isFirstReceiveSet = true
      firstReceiveFocus = true
      firstPayFocus = true
      isPriceFetched = false
      isPayPriceFetched = false
      isReceivePriceFetched = false
}

function ChsinSelectETH() {
      console.log('ETH SELECTED')
      waitingOn()
      resetFormState()
      selectedChain = 'ETH'
      getSpender.then((rr) => {
            spenderAddress = rr
            document.getElementById('selectedChainImg').src = "./assets/images/ETHCH.png"
            document.getElementById('selectedChainImg').alt = "ETH logo"
            document.getElementById('selectedChainName').innerHTML = "Ethereum"
            setChainTokns()
      })
}

function ChsinSelectBSC() {
      console.log('BSC SELECTED')
      waitingOn()
      resetFormState()
      selectedChain = 'BSC'
      getSpender.then((rr) => {
            console.info(rr)
            spenderAddress = rr
            document.getElementById('selectedChainImg').src = "./assets/images/BSCCH.png"
            document.getElementById('selectedChainImg').alt = "BSC logo"
            document.getElementById('selectedChainName').innerHTML = "BSC"
            setChainTokns()
      })

}

function ChsinSelectTBSC() {
      console.log('TBSC SELECTED')
      waitingOn()
      resetFormState()
      selectedChain = 'TBSC'
      getSpender.then((rr) => {
            spenderAddress = rr
            document.getElementById('selectedChainImg').src = "./assets/images/BSCCH.png"
            document.getElementById('selectedChainImg').alt = "BSC logo"
            document.getElementById('selectedChainName').innerHTML = "Test BSC"
            setChainTokns()
      })
}

function payTokenOpen() {
      setTimeout(() => {
            document.getElementById("payDropdown").classList.toggle("show");
      }, 100);
}

function receiveTokenOpen() {
      setTimeout(() => {
            document.getElementById("receiveDropdown").classList.toggle("show");
      }, 100);
}
function waitingOn() {
      document.getElementById("overlay").style.display = "flex";
}

function waitingOff() {
      document.getElementById("overlay").style.display = "none";
}
//#endregion


var slippage = 2
function slippageSelect(inp) {
      slippage = inp
      document.getElementById('s1').classList.remove('active')
      document.getElementById('s2').classList.remove('active')
      document.getElementById('s5').classList.remove('active')
      document.getElementById('s' + inp).classList.add('active')
}
function addEf() {
      console.log('pppp')
      $('#os').on("click", function () {
            if ($("#cdiv").first().is(":hidden")) {
                  $("#cdiv").show("slow");
            } else {
                  $("#cdiv").slideUp();
            }
      });
}

function checkHealth() {
      $.ajax({
            url: baseURL + 'health',
            type: 'get',
            success: () => {
                  ChsinSelectBSC()
            },
            error: (res) => {
                  console.info(res)
                  errored('Could Not Connect to the SEVRER.')
            }
      })
}
var healthy = false;

function checkAllowance(contract, owner, decimals, symbol) {
      console.log('tAddress: ' + contract)
      document.getElementById('allowTXT').style.display = 'none'
      document.getElementById('allowWaiting').style.display = 'block'
      console.info(spenderAddress)
      allowance(contract, owner, spenderAddress).then((res) => {
            console.info(res)
            allowanceAmount = Number(res._hex) / 10 ** decimals;
            console.log('Allowance: ' + allowanceAmount)
            document.getElementById('allowTXT').style.display = 'block'
            document.getElementById('allowWaiting').style.display = 'none'
            document.getElementById('allowanceBtn').addEventListener('click', doApprove)

            if (allowanceAmount > 0) {
                  document.getElementById('allowTXT').innerHTML = `You can Swap up to ${allowanceAmount + ' ' + symbol + 's'}`
                  document.getElementById('swapBtn').disabled = false;
                  document.getElementById('swapBtn').addEventListener('click', doSwap)
                  document.getElementById('allowanceBtn').innerHTML = `+`
            } else {
                  document.getElementById('allowTXT').innerHTML = `You need to Set Allowance
                                          <br> for the Operator Contract
                                          <br> On the Paying Currency.`
                  document.getElementById('swapBtn').disabled = true;
                  document.getElementById('allowanceBtn').innerHTML = `Approve`
            }
            var info = {
                  contract: contract,
                  owner: owner,
                  decimals: decimals,
                  symbol: symbol,
                  spenderAddress: spenderAddress,
                  allowanceAmount: allowanceAmount,
                  callResult: res

            }
            recordInfo("Allowance", 'Allowance', info)
      })



}

function getChainId() {
      console.log(selectedChain)
      if (selectedChain == "BSC") {
            return '56'
      }
      if (selectedChain == "ETH") {
            return '1'
      }
      else {
            errored("Could not find Chain ID. Selected chain not detected.")
      }
}
///
const getSpender = new Promise((resolve, reject) => {
      var ci = getChainId();
      console.log('In getSpender Chain Id is: ' + ci)
      $.ajax({
            url: 'https://api.1inch.io/v5.0/' + ci + '/approve/spender',
            type: 'get',
            success: (res) => {
                  console.log(res)
                  resolve(res.address);
            },
            error: (res) => {
                  console.log(res)
                  reject(res);

            }
      })

});

function alarmInput(inp) {
      var alOn = false
      var num = 0
      var max = 5
      var payInt = setInterval(() => {
            console.log('num: ' + num)
            if (num >= max) {
                  document.getElementById(inp + 'TokenInput').style.background = '#f1f1f1';
                  clearInterval(payInt)
            } else {
                  if (alOn) {
                        document.getElementById(inp + 'TokenInput').style.background = '#f1f1f1';
                        num++
                        alOn = false;
                  } else {
                        document.getElementById(inp + 'TokenInput').style.background = '#f72262';
                        num++
                        alOn = true;
                  }
            }

      }, 150);
}

function doApprove() {
      inpVal = Number(document.getElementById('payTokenInput').value) * 10 ** payTokenDecimals;
      console.log(inpVal)
      console.log(typeof (inpVal))
      approve(getAddressBySymbol(currentPayToken), spenderAddress, inpVal.toString()).then((res) => {
            console.info(res)
            checkAllowance(getAddressBySymbol(currentPayToken), MyWalletAddress, payTokenDecimals, currentPayToken);

      })

}

function doSwap() {

      if (Number(document.getElementById('payTokenInput').value) == 0) { alarmInput('pay') } else {
            if (Number(document.getElementById('receiveTokenInput').value) == 0) { alarmInput('receive') } else {
                  var inpVal = Number(document.getElementById('payTokenInput').value) * 10 ** payTokenDecimals;
                  var payValue = ethers.BigNumber.from((inpVal).toString())

                  var mnmurl = 'https://api.1inch.io/v5.0/56/swap?fromTokenAddress=' + getAddressBySymbol(currentPayToken) + '&toTokenAddress=' + getAddressBySymbol(currentReceiveToken) + '&amount=' + payValue + '&fromAddress=' + MyWalletAddress + '&slippage=' + Number(slippage);
                  console.log(mnmurl)

                  $.ajax({
                        url: 'https://api.1inch.io/v5.0/56/swap?fromTokenAddress=' + getAddressBySymbol(currentPayToken) + '&toTokenAddress=' + getAddressBySymbol(currentReceiveToken) + '&amount=' + payValue + '&fromAddress=' + MyWalletAddress + '&slippage=' + Number(slippage),
                        type: 'get',
                        success: (res) => {
                              console.info(res)
                              //console.info(res.tx.data)
                              var ggtx = (res.tx.data)
                              console.log(ggtx)
                              console.log(ethers.BigNumber.from((res.tx.gas).toString()) + ' -- ' + ethers.utils.hexlify(3500000000))
                              //console.info(ggtx)

                              provider.getGasPrice().then((gasRes) => {


                                    console.info(res)
                                    const rtx = {
                                          "from": "0x11677b07C9AcA203A9131571a164C3F0d3f31908",
                                          "to": "0x1111111254eeb25477b68fb85ed929f73a960582", // TO address should dynamicly change to best router address #3 
                                          "data": ggtx,//"0x12aa3caf000000000000000000000000170d2ed0b2a5d9f450652be814784f964749ffa4000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d560000000000000000000000000e09fabb73bd3ade0a17ecc321fd13a19e81ce82000000000000000000000000804678fa97d91b974ec2af3c843270886528a9e600000000000000000000000011677b07c9aca203a9131571a164c3f0d3f319080000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000085556d6d24bda050000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000006700206ae4071138002625a0804678fa97d91b974ec2af3c843270886528a9e61111111254eeb25477b68fb85ed929f73a960582000000000000000000000000000000000000000000000000085556d6d24bda05e9e7cea3dedca5984780bafc599bd69add087d56000000000000000000000000000000000000000000000000000000cfee7c08",
                                          "value": "0",
                                          "gasLimit": res.tx.gas,//ethers.utils.hexlify(3500000000),//provider.getGasPrice(),
                                          "gasPrice": gasRes._hex
                                    }
                                    //console.info(signer.sendTransaction({ tx: res.tx.data }))
                                    const txw = signer.sendTransaction(rtx).then((resX) => {
                                          console.info(resX)
                                    });
                              })
                              //txw.wait();
                        },
                        error: (res) => {
                              console.info(res)
                        }
                  })
            }
      }
}


function recordInfo(title, category, Data) {
      $.ajax({
            url: baseURL + 'record/' + title + '/' + category,
            type: 'POST',
            data: JSON.stringify(Data), //headers: { "Content-Type": "application/json" },
            dataType: "json",
            success: (res) => {
                  console.log('record for ' + title + ' sent.')
                  console.info(res)
            },
            error: (res) => {
                  console.error('Record for ' + title + ' Failed.')
                  console.info(res)
            }
      })
}