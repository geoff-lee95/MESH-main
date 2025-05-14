import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

// Get the Solana network from environment variables
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"

// Create a connection to the Solana network
export const getConnection = () => {
  return new Connection(
    SOLANA_NETWORK === "mainnet-beta"
      ? clusterApiUrl("mainnet-beta")
      : SOLANA_NETWORK === "testnet"
        ? clusterApiUrl("testnet")
        : clusterApiUrl("devnet"),
    "confirmed",
  )
}

// Helper function to get Solana explorer URL for a transaction
export const getSolanaExplorerUrl = (signature: string) => {
  const baseUrl =
    SOLANA_NETWORK === "mainnet-beta"
      ? "https://explorer.solana.com"
      : `https://explorer.solana.com/?cluster=${SOLANA_NETWORK}`

  return `${baseUrl}/tx/${signature}`
}

// Helper function to get Solana explorer URL for an address
export const getSolanaExplorerAddressUrl = (address: string) => {
  const baseUrl =
    SOLANA_NETWORK === "mainnet-beta"
      ? "https://explorer.solana.com"
      : `https://explorer.solana.com/?cluster=${SOLANA_NETWORK}`

  return `${baseUrl}/address/${address}`
}

// Format SOL amount for display (convert from lamports to SOL)
export const formatSol = (lamports: number) => {
  return (lamports / LAMPORTS_PER_SOL).toFixed(2)
}

// Parse SOL amount from string to lamports
export const parseSol = (sol: string) => {
  return Math.floor(Number.parseFloat(sol) * LAMPORTS_PER_SOL)
}

// Shorten a Solana address for display
export const shortenAddress = (address: string, chars = 4) => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

// Validate a Solana address
export const isValidSolanaAddress = (address: string) => {
  try {
    new PublicKey(address)
    return true
  } catch (error) {
    return false
  }
}

// Convert SOL to lamports
export const solToLamports = (sol: number): number => {
  return Math.floor(sol * LAMPORTS_PER_SOL)
}

// Convert lamports to SOL
export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL
}

// Create a payment transaction
export const createPaymentTransaction = async (
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amountSol: number,
): Promise<Transaction> => {
  const connection = getConnection()
  const lamports = solToLamports(amountSol)

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash()

  // Create transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    }),
  )

  // Set recent blockhash and fee payer
  transaction.recentBlockhash = blockhash
  transaction.feePayer = fromPubkey

  return transaction
}

// Verify transaction
export const verifyTransaction = async (signature: string): Promise<boolean> => {
  try {
    const connection = getConnection()
    const status = await connection.confirmTransaction(signature, "confirmed")
    return !status.value.err
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return false
  }
}

// Get transaction details
export const getTransactionDetails = async (signature: string) => {
  try {
    const connection = getConnection()
    return await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })
  } catch (error) {
    console.error("Error getting transaction details:", error)
    return null
  }
}
