const ethers = require('ethers');  
const crypto = require ('crypto');
const {utils} = require('ethereumjs-util');


let sendEthers = async ()=>{
const privateKey = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
let wallet = new ethers.Wallet(privateKey).connect(provider);


tx = {
    to: "0x35E95CFa48001B9025b560D0865E4F8540313d8d",
    value: ethers.utils.parseEther("20.0"),
 
}
    await wallet.sendTransaction(tx);
}


sendEthers();
