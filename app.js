console.log(Keccak256(EthUtil.rlp.encode( ["0x692a70D2e424a56D2C6C27aA97D1a86395877b3A",
EthUtil.intToHex(1)])).slice(12).toString('hex'));