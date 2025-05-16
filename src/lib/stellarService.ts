import * as StellarSdk from "stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const networkPassphrase = StellarSdk.Networks.TESTNET;

const treasurySecret = process.env.NEXT_PUBLIC_TREASURY_SECRET!;
const treasuryKeypair = StellarSdk.Keypair.fromSecret(treasurySecret);

export async function sendPrizeTransaction(winnerWalletAddress: string, amount: string): Promise<string> {
    const account = await server.loadAccount(treasuryKeypair.publicKey());
    const fee = await server.fetchBaseFee();

    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase,
    })
        .addOperation(StellarSdk.Operation.payment({
            destination: winnerWalletAddress,
            asset: StellarSdk.Asset.native(),
            amount,
        }))
        .setTimeout(30)
        .build();

    transaction.sign(treasuryKeypair);

    const result = await server.submitTransaction(transaction);
    return result.hash;
}