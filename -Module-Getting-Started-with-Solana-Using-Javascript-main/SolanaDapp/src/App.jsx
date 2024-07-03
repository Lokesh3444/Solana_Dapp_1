import {
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";

function App() {
  window.Buffer = Buffer;
  const [Toadd, setToadd] = useState("");
  const [Fromadd, setFromadd] = useState("");
  const [keypair, setkeypair] = useState(null);
  const [connection, setConnection] = useState(null);

  const ConnectWallet = async () => {
    const { solana } = window;
    if (solana) {
      try {
        const response = await solana.connect();
        console.log(response.publicKey.toString());
        setToadd(response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const Transfer = async () => {
    console.log("Transfer method invoked");

    try {
      if (!keypair || !connection) {
        console.error("Keypair or connection not initialized");
        return;
      }

      console.log("trying.....");
      const transaction = new Transaction();
      const instruction = SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(Toadd),
        lamports: 1 * LAMPORTS_PER_SOL,
      });
      transaction.add(instruction);

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );
      console.log("Transaction is successfull");
      console.log("Transaction Signature:", signature);
    } catch (err) {
      console.error(err);
    }
  };

  const CreateKeyPair = async () => {
    const newKeypair = Keypair.generate();
    setkeypair(newKeypair);
    const pubkey = newKeypair.publicKey.toString();
    console.log("PublicKey :", pubkey);
    setFromadd(pubkey);
    const newConnection = new Connection("http://127.0.0.1:8899", "confirmed");
    setConnection(newConnection);

    try {
      let airdropSignature = await newConnection.requestAirdrop(
        newKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );

      await newConnection.confirmTransaction(airdropSignature);

      console.log("Airdropped 2 SOL");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex flex-column mb-3 p-2">
        <p>Solana Assignment</p>
        <label className="p-3 m-3">
          <span>Step1:</span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={ConnectWallet}
          >
            Connect Wallet
          </button>
        </label>
        <label className="p-3 m-3">
          <span>Step2:</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={CreateKeyPair}
          >
            Create Account
          </button>
        </label>
        <label className="p-3 m-3">
          <span>Step3:</span>
          <button type="button" className="btn btn-success" onClick={Transfer}>
            Transfer
          </button>
        </label>
      </div>
    </>
  );
}

export default App;
