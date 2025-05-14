import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"
import { Program, AnchorProvider, BN, web3 } from "@project-serum/anchor"
import { getConnection } from "@/lib/solana"
import { IDL } from "@/lib/escrow-idl"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"

// Define the escrow program ID from environment variables
export const ESCROW_PROGRAM_ID = process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID
  ? new PublicKey(process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID)
  : new PublicKey("Escr1bEQwvZYLdYYnottA1eEHnnEE1hzXXXXXXXXXXXX") // Default to escrow program if not set

// Constants
export const ESCROW_ADMIN_PUBKEY = new PublicKey("AdminXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

// Escrow status enum
export enum EscrowStatus {
  Active = "Active",
  Completed = "Completed",
  Refunded = "Refunded",
  Disputed = "Disputed",
  Split = "Split",
}

// Dispute status enum
export enum DisputeStatus {
  Open = "Open",
  Resolved = "Resolved",
}

// Dispute resolution enum
export enum DisputeResolution {
  ReleaseToAgent = "ReleaseToAgent",
  RefundToOwner = "RefundToOwner",
  Split = "Split",
}

// Get escrow program
export const getEscrowProgram = (wallet: any) => {
  const connection = getConnection()
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "processed" })
  return new Program(IDL, ESCROW_PROGRAM_ID, provider)
}

// Get escrow account PDA
export const getEscrowPDA = async (intentId: string) => {
  const [escrowPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("escrow"), Buffer.from(intentId)],
    ESCROW_PROGRAM_ID,
  )
  return escrowPDA
}

// Get dispute account PDA
export const getDisputePDA = async (escrowPDA: PublicKey) => {
  const [disputePDA] = await PublicKey.findProgramAddress(
    [Buffer.from("dispute"), escrowPDA.toBuffer()],
    ESCROW_PROGRAM_ID,
  )
  return disputePDA
}

// Initialize escrow
export const initializeEscrow = async (wallet: any, intentId: string, amount: number, agentPubkey: string) => {
  try {
    const program = getEscrowProgram(wallet)
    const escrowPDA = await getEscrowPDA(intentId)
    const agentPublicKey = new PublicKey(agentPubkey)

    // Convert SOL to lamports
    const lamports = new BN(amount * LAMPORTS_PER_SOL)

    // Get token accounts
    const intentOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      wallet.publicKey,
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      wallet.publicKey,
    )

    // Create escrow token account
    const escrowTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      wallet.publicKey,
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowPDA,
      true,
    )

    // Initialize escrow
    const tx = await program.methods
      .initializeEscrow(intentId, lamports, agentPublicKey)
      .accounts({
        escrow: escrowPDA,
        intentOwner: wallet.publicKey,
        intentOwnerToken: intentOwnerTokenAccount.address,
        escrowToken: escrowTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .transaction()

    // Sign and send transaction
    const signature = await wallet.sendTransaction(tx, program.provider.connection)
    await program.provider.connection.confirmTransaction(signature, "confirmed")

    return {
      success: true,
      signature,
      escrowAddress: escrowPDA.toString(),
    }
  } catch (error) {
    console.error("Error initializing escrow:", error)
    return {
      success: false,
      error: error.message || "Failed to initialize escrow",
    }
  }
}

// Release funds to agent
export const releaseFunds = async (wallet: any, intentId: string, agentPubkey: string) => {
  try {
    const program = getEscrowProgram(wallet)
    const escrowPDA = await getEscrowPDA(intentId)
    const agentPublicKey = new PublicKey(agentPubkey)

    // Get token accounts
    const escrowTokenAccount = await getAssociatedTokenAddress(
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowPDA,
      true,
    )

    const agentTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      wallet.publicKey,
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      agentPublicKey,
    )

    // Release funds
    const tx = await program.methods
      .releaseFunds()
      .accounts({
        escrow: escrowPDA,
        intentOwner: wallet.publicKey,
        escrowToken: escrowTokenAccount,
        agentToken: agentTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction()

    // Sign and send transaction
    const signature = await wallet.sendTransaction(tx, program.provider.connection)
    await program.provider.connection.confirmTransaction(signature, "confirmed")

    return {
      success: true,
      signature,
    }
  } catch (error) {
    console.error("Error releasing funds:", error)
    return {
      success: false,
      error: error.message || "Failed to release funds",
    }
  }
}

// Refund to intent owner
export const refundEscrow = async (wallet: any, intentId: string) => {
  try {
    const program = getEscrowProgram(wallet)
    const escrowPDA = await getEscrowPDA(intentId)

    // Get escrow account data
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA)

    // Get token accounts
    const escrowTokenAccount = await getAssociatedTokenAddress(
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowPDA,
      true,
    )

    const intentOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      wallet.publicKey,
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowAccount.intentOwner,
    )

    // Refund
    const tx = await program.methods
      .refund()
      .accounts({
        escrow: escrowPDA,
        intentOwner: wallet.publicKey,
        disputeResolver: wallet.publicKey,
        programAdmin: ESCROW_ADMIN_PUBKEY,
        escrowToken: escrowTokenAccount,
        intentOwnerToken: intentOwnerTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction()

    // Sign and send transaction
    const signature = await wallet.sendTransaction(tx, program.provider.connection)
    await program.provider.connection.confirmTransaction(signature, "confirmed")

    return {
      success: true,
      signature,
    }
  } catch (error) {
    console.error("Error refunding escrow:", error)
    return {
      success: false,
      error: error.message || "Failed to refund escrow",
    }
  }
}

// Create dispute
export const createDispute = async (wallet: any, intentId: string, reason: string) => {
  try {
    const program = getEscrowProgram(wallet)
    const escrowPDA = await getEscrowPDA(intentId)
    const disputePDA = await getDisputePDA(escrowPDA)

    // Create dispute
    const tx = await program.methods
      .createDispute(reason)
      .accounts({
        escrow: escrowPDA,
        dispute: disputePDA,
        disputer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .transaction()

    // Sign and send transaction
    const signature = await wallet.sendTransaction(tx, program.provider.connection)
    await program.provider.connection.confirmTransaction(signature, "confirmed")

    return {
      success: true,
      signature,
      disputeAddress: disputePDA.toString(),
    }
  } catch (error) {
    console.error("Error creating dispute:", error)
    return {
      success: false,
      error: error.message || "Failed to create dispute",
    }
  }
}

// Resolve dispute (admin only)
export const resolveDispute = async (
  wallet: any,
  intentId: string,
  resolution: DisputeResolution,
  agentPercentage?: number,
) => {
  try {
    const program = getEscrowProgram(wallet)
    const escrowPDA = await getEscrowPDA(intentId)
    const disputePDA = await getDisputePDA(escrowPDA)

    // Get escrow account data
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA)

    // Get token accounts
    const escrowTokenAccount = await getAssociatedTokenAddress(
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowPDA,
      true,
    )

    const agentTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      wallet.publicKey,
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowAccount.agent,
    )

    const intentOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      wallet.publicKey,
      new PublicKey("So11111111111111111111111111111111111111112"), // Wrapped SOL mint
      escrowAccount.intentOwner,
    )

    // Prepare resolution data
    let resolutionData
    if (resolution === DisputeResolution.ReleaseToAgent) {
      resolutionData = { releaseToAgent: {} }
    } else if (resolution === DisputeResolution.RefundToOwner) {
      resolutionData = { refundToOwner: {} }
    } else if (resolution === DisputeResolution.Split) {
      resolutionData = { split: { agentPercentage } }
    }

    // Resolve dispute
    const tx = await program.methods
      .resolveDispute(resolutionData)
      .accounts({
        escrow: escrowPDA,
        dispute: disputePDA,
        resolver: wallet.publicKey,
        programAdmin: ESCROW_ADMIN_PUBKEY,
        escrowToken: escrowTokenAccount,
        agentToken: agentTokenAccount.address,
        intentOwnerToken: intentOwnerTokenAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction()

    // Sign and send transaction
    const signature = await wallet.sendTransaction(tx, program.provider.connection)
    await program.provider.connection.confirmTransaction(signature, "confirmed")

    return {
      success: true,
      signature,
    }
  } catch (error) {
    console.error("Error resolving dispute:", error)
    return {
      success: false,
      error: error.message || "Failed to resolve dispute",
    }
  }
}

// Get escrow account data
export const getEscrowData = async (intentId: string) => {
  try {
    const connection = getConnection()
    const program = new Program(
      IDL,
      ESCROW_PROGRAM_ID,
      new AnchorProvider(connection, null, { preflightCommitment: "processed" }),
    )

    const escrowPDA = await getEscrowPDA(intentId)
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA)

    return {
      success: true,
      data: {
        intentOwner: escrowAccount.intentOwner.toString(),
        agent: escrowAccount.agent.toString(),
        intentId: escrowAccount.intentId,
        amount: escrowAccount.amount.toNumber() / LAMPORTS_PER_SOL,
        status: EscrowStatus[escrowAccount.status],
        createdAt: new Date(escrowAccount.createdAt * 1000),
        updatedAt: new Date(escrowAccount.updatedAt * 1000),
      },
    }
  } catch (error) {
    console.error("Error getting escrow data:", error)
    return {
      success: false,
      error: error.message || "Failed to get escrow data",
    }
  }
}

// Get dispute account data
export const getDisputeData = async (intentId: string) => {
  try {
    const connection = getConnection()
    const program = new Program(
      IDL,
      ESCROW_PROGRAM_ID,
      new AnchorProvider(connection, null, { preflightCommitment: "processed" }),
    )

    const escrowPDA = await getEscrowPDA(intentId)
    const disputePDA = await getDisputePDA(escrowPDA)

    try {
      const disputeAccount = await program.account.disputeAccount.fetch(disputePDA)

      return {
        success: true,
        data: {
          escrow: disputeAccount.escrow.toString(),
          disputer: disputeAccount.disputer.toString(),
          reason: disputeAccount.reason,
          status: DisputeStatus[disputeAccount.status],
          resolution: disputeAccount.resolution
            ? {
                type: Object.keys(disputeAccount.resolution)[0],
                agentPercentage: disputeAccount.resolution.split?.agentPercentage,
              }
            : null,
          createdAt: new Date(disputeAccount.createdAt * 1000),
          updatedAt: new Date(disputeAccount.updatedAt * 1000),
        },
      }
    } catch (e) {
      // Dispute doesn't exist
      return {
        success: true,
        data: null,
      }
    }
  } catch (error) {
    console.error("Error getting dispute data:", error)
    return {
      success: false,
      error: error.message || "Failed to get dispute data",
    }
  }
}

// Function to create an escrow deposit transaction
export const createEscrowDepositTransaction = async (
  payerPublicKey: PublicKey,
  recipientPublicKey: PublicKey,
  amountLamports: number,
  intentId: string,
): Promise<Transaction> => {
  const connection = getConnection()

  // For now, we'll use a simple SOL transfer as a placeholder
  // In a real implementation, this would interact with the escrow program
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payerPublicKey,
      toPubkey: recipientPublicKey,
      lamports: amountLamports,
    }),
  )

  // Get the recent blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = payerPublicKey

  return transaction
}

// Function to create an escrow release transaction
export const createEscrowReleaseTransaction = async (
  payerPublicKey: PublicKey,
  recipientPublicKey: PublicKey,
  amountLamports: number,
  escrowId: string,
): Promise<Transaction> => {
  const connection = getConnection()

  // For now, we'll use a simple SOL transfer as a placeholder
  // In a real implementation, this would interact with the escrow program
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payerPublicKey,
      toPubkey: recipientPublicKey,
      lamports: amountLamports,
    }),
  )

  // Get the recent blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = payerPublicKey

  return transaction
}

// Function to verify a transaction
export const verifyTransaction = async (signature: string): Promise<boolean> => {
  try {
    const connection = getConnection()
    const result = await connection.confirmTransaction(signature)
    return !result.value.err
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return false
  }
}

// Function to get transaction details
export const getTransactionDetails = async (signature: string) => {
  try {
    const connection = getConnection()
    return await connection.getTransaction(signature, {
      commitment: "confirmed",
    })
  } catch (error) {
    console.error("Error getting transaction details:", error)
    return null
  }
}

// Function to convert SOL to lamports
export const solToLamports = (sol: number): number => {
  return Math.floor(sol * LAMPORTS_PER_SOL)
}

// Function to convert lamports to SOL
export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL
}
