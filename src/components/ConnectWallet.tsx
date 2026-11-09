"use client";

import { useEffect, useRef, useState } from "react";
import type { NearConnector } from "@hot-labs/near-connect";

// MetaMask signs for a NEAR account through NEAR's "Ethereum Wallets" (EVM-on-NEAR) executor.
const NETWORK = "testnet";
const WALLET_ID = "ethereum-wallets";

export default function ConnectWallet() {
  const connector = useRef<NearConnector | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const onSignIn = ({ accounts }: { accounts: { accountId: string }[] }) => setAccount(accounts[0]?.accountId ?? null);
    const onSignOut = () => setAccount(null);

    // Imported lazily: the connector touches window and IndexedDB.
    import("@hot-labs/near-connect").then(({ NearConnector }) => {
      if (cancelled) return;
      const c = new NearConnector({ network: NETWORK });
      connector.current = c;
      c.on("wallet:signIn", onSignIn);
      c.on("wallet:signOut", onSignOut);
      c.getConnectedWallet()
        .then(({ accounts }) => !cancelled && setAccount(accounts[0]?.accountId ?? null))
        .catch(() => {}); // nobody signed in yet
    });

    return () => {
      cancelled = true;
      connector.current?.off("wallet:signIn", onSignIn);
      connector.current?.off("wallet:signOut", onSignOut);
    };
  }, []);

  async function connect() {
    if (!connector.current) return;
    setBusy(true);
    setError(null);
    try {
      await connector.current.connect({ walletId: WALLET_ID });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect MetaMask.");
    } finally {
      setBusy(false);
    }
  }

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <a
          href={`https://testnet.nearblocks.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          title={`${account} on NEAR ${NETWORK}`}
          className="max-w-[9rem] truncate text-foreground transition-colors hover:text-pcmb-blue"
        >
          {account}
        </a>
        <button
          type="button"
          onClick={() => connector.current?.disconnect()}
          className="cursor-pointer transition-colors hover:text-foreground"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {error && (
        <span role="alert" className="max-w-[10rem] truncate normal-case tracking-normal text-pcmb-red" title={error}>
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={connect}
        disabled={busy}
        className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-foreground transition-colors hover:border-pcmb-blue/60 disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? "Connecting…" : "Connect MetaMask"}
      </button>
    </div>
  );
}
