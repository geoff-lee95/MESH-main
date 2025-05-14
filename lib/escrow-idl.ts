export const IDL = {
  version: "0.1.0",
  name: "mesh_escrow",
  instructions: [
    {
      name: "initializeEscrow",
      accounts: [
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "intentOwner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "intentOwnerToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "intentId",
          type: "string",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "agentPubkey",
          type: "publicKey",
        },
      ],
    },
    {
      name: "releaseFunds",
      accounts: [
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "intentOwner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "escrowToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "agentToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "refund",
      accounts: [
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "intentOwner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "disputeResolver",
          isMut: true,
          isSigner: true,
        },
        {
          name: "programAdmin",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "intentOwnerToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createDispute",
      accounts: [
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "dispute",
          isMut: true,
          isSigner: false,
        },
        {
          name: "disputer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reason",
          type: "string",
        },
      ],
    },
    {
      name: "resolveDispute",
      accounts: [
        {
          name: "escrow",
          isMut: true,
          isSigner: false,
        },
        {
          name: "dispute",
          isMut: true,
          isSigner: false,
        },
        {
          name: "resolver",
          isMut: true,
          isSigner: true,
        },
        {
          name: "programAdmin",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "agentToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "intentOwnerToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "resolution",
          type: {
            defined: "DisputeResolution",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "EscrowAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "intentOwner",
            type: "publicKey",
          },
          {
            name: "agent",
            type: "publicKey",
          },
          {
            name: "intentId",
            type: "string",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "status",
            type: {
              defined: "EscrowStatus",
            },
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "updatedAt",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "DisputeAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "escrow",
            type: "publicKey",
          },
          {
            name: "disputer",
            type: "publicKey",
          },
          {
            name: "reason",
            type: "string",
          },
          {
            name: "status",
            type: {
              defined: "DisputeStatus",
            },
          },
          {
            name: "resolution",
            type: {
              option: {
                defined: "DisputeResolution",
              },
            },
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "updatedAt",
            type: "i64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "EscrowStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active",
          },
          {
            name: "Completed",
          },
          {
            name: "Refunded",
          },
          {
            name: "Disputed",
          },
          {
            name: "Split",
          },
        ],
      },
    },
    {
      name: "DisputeStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Open",
          },
          {
            name: "Resolved",
          },
        ],
      },
    },
    {
      name: "DisputeResolution",
      type: {
        kind: "enum",
        variants: [
          {
            name: "ReleaseToAgent",
          },
          {
            name: "RefundToOwner",
          },
          {
            name: "Split",
            fields: [
              {
                name: "agentPercentage",
                type: "u8",
              },
            ],
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "EscrowCreatedEvent",
      fields: [
        {
          name: "escrow",
          type: "publicKey",
          index: false,
        },
        {
          name: "intentId",
          type: "string",
          index: false,
        },
        {
          name: "intentOwner",
          type: "publicKey",
          index: false,
        },
        {
          name: "agent",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "FundsReleasedEvent",
      fields: [
        {
          name: "escrow",
          type: "publicKey",
          index: false,
        },
        {
          name: "intentId",
          type: "string",
          index: false,
        },
        {
          name: "agent",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "FundsRefundedEvent",
      fields: [
        {
          name: "escrow",
          type: "publicKey",
          index: false,
        },
        {
          name: "intentId",
          type: "string",
          index: false,
        },
        {
          name: "intentOwner",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "DisputeCreatedEvent",
      fields: [
        {
          name: "dispute",
          type: "publicKey",
          index: false,
        },
        {
          name: "escrow",
          type: "publicKey",
          index: false,
        },
        {
          name: "intentId",
          type: "string",
          index: false,
        },
        {
          name: "disputer",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "DisputeResolvedEvent",
      fields: [
        {
          name: "dispute",
          type: "publicKey",
          index: false,
        },
        {
          name: "escrow",
          type: "publicKey",
          index: false,
        },
        {
          name: "intentId",
          type: "string",
          index: false,
        },
        {
          name: "resolution",
          type: {
            defined: "DisputeResolution",
          },
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "Unauthorized",
      msg: "Unauthorized access",
    },
    {
      code: 6001,
      name: "InvalidEscrowStatus",
      msg: "Invalid escrow status",
    },
    {
      code: 6002,
      name: "InvalidDisputeStatus",
      msg: "Invalid dispute status",
    },
  ],
}
