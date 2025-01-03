const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
} = require("@solana/web3.js");
const {
  createUpdateMetadataAccountV2Instruction,
  MetadataDataData,
} = require("@metaplex-foundation/mpl-token-metadata");

(async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  // Load your wallet keypair
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from(require("/Users/dstoyanov/.config/solana/id.json"))
  );

  // Constants
  const mintAddress = new PublicKey("2JQJHkBHt9bbRAx94tAXW2JdFfVgxFL9f7GM5RFiRPxS");
  const PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  // Derive Metadata PDA
  const [metadataPDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer(),
    ],
    PROGRAM_ID
  );

  console.log("Metadata PDA:", metadataPDA.toBase58());

  // Metadata structure
  const metadata = new MetadataDataData({
    name: "Tradecoin",
    symbol: "T212",
    uri: "https://arweave.net/u-IBEr3D6PDqvftjcRLW0clsutjDV_bYRilwkeORpSs",
    sellerFeeBasisPoints: 500,
    creators: [
      {
        address: wallet.publicKey.toBase58(),
        verified: true,
        share: 100,
      },
    ],
  });

  // Create the instruction
  const instruction = createUpdateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      updateAuthority: wallet.publicKey,
    },
    {
      data: metadata,
      updateAuthority: wallet.publicKey,
      primarySaleHappened: null,
      isMutable: true,
    }
  );

  // Create and send the transaction
  const transaction = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(transaction, [wallet]);

  console.log("Metadata update transaction signature:", signature);
})();

