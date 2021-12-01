async function main() {
  const MadaraTestnet = await hre.ethers.getContractFactory("MadaraTestnet");
  const nft = await MadaraTestnet.deploy();

  await nft.deployed();

  console.log("MadaraTestnet deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  //QmRhg5LHqnevogemMz7whz4V19NfzbvKADanrVnXfBd6xW
