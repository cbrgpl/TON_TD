import { getHttpEndpoint } from "@orbs-network/ton-access"
import { TonClient, WalletContractV4, fromNano, internal } from "@ton/ton"
import { mnemonicToWalletKey } from "@ton/crypto"

// 1. UQD1ixD6IurNTtc-bd8ZsxVdHIODqWFlxl--a3CJs3x_Q4Af
// 2. 0QD1ixD6IurNTtc-bd8ZsxVdHIODqWFlxl--a3CJs3x_QzuV

// ability kingdom become column winner girl stumble bread link common avoid delay lock sleep reject vibrant random that rail lyrics rent tubmle boost again
const main = async () => {
  const mnemonic = "ability kingdom become column winner girl stumble bread link common avoid delay lock sleep reject vibrant random that rail lyrics rent tumble boost again"
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  console.log(`Адрес: ${wallet.address.toString({ testOnly: true })}`);

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "UQD1ixD6IurNTtc-bd8ZsxVdHIODqWFlxl--a3CJs3x_Q4Af",
        value: "0.05",
        body: "Sent programatically",
        bounce: false,
      })
    ]
  });

  console.log("seqno:", seqno);
}

main();


// const client = new TonClient({
//   endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
// });

// let mnemonics = await mnemonicNew();
// let keyPair = await mnemonicToPrivateKey(mnemonics);

// let workchain = 0; // Usually you need a workchain 0
// let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
// let contract = client.open(wallet);

// let balance = await contract.getBalance();

// const main = async () => {
//   let seqno = await contract.getSeqno();
//   let transfer = await contract.createTransfer({
//     seqno,
//     secretKey: keyPair.secretKey,
//     messages: [
//       internal({
//         value: '1.5',
//         to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
//         body: 'Hello world',
//       })
//     ]
//   });
  
//   console.log(transfer)
// }

// main()