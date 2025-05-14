import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { WalletList } from "../WalletList"
import { WalletMetadata } from "../wallet-provider"

describe("WalletList", () => {
  const wallets: WalletMetadata[] = [
    { address: "wallet1", provider: "phantom", nickname: "Main" },
    { address: "wallet2", provider: "solflare" },
  ]

  it("renders all wallets", () => {
    render(
      <WalletList
        wallets={wallets}
        primaryWallet="wallet1"
        onSetPrimary={jest.fn()}
        onRemove={jest.fn()}
      />
    )
    expect(screen.getByText(/wallet1/i)).toBeInTheDocument()
    expect(screen.getByText(/wallet2/i)).toBeInTheDocument()
    expect(screen.getByText(/Main/)).toBeInTheDocument()
  })

  it("calls onSetPrimary when set as primary is clicked", () => {
    const onSetPrimary = jest.fn()
    render(
      <WalletList
        wallets={wallets}
        primaryWallet="wallet2"
        onSetPrimary={onSetPrimary}
        onRemove={jest.fn()}
      />
    )
    const setPrimaryBtn = screen.getAllByText(/Set as Primary/i)[0]
    fireEvent.click(setPrimaryBtn)
    expect(onSetPrimary).toHaveBeenCalledWith("wallet1")
  })

  it("calls onRemove when remove is clicked", () => {
    const onRemove = jest.fn()
    render(
      <WalletList
        wallets={wallets}
        primaryWallet="wallet1"
        onSetPrimary={jest.fn()}
        onRemove={onRemove}
      />
    )
    const removeBtn = screen.getAllByText(/Remove/i)[0]
    fireEvent.click(removeBtn)
    expect(onRemove).toHaveBeenCalledWith("wallet1")
  })

  it("allows editing nickname", () => {
    const onEditNickname = jest.fn()
    render(
      <WalletList
        wallets={wallets}
        primaryWallet="wallet1"
        onSetPrimary={jest.fn()}
        onRemove={jest.fn()}
        onEditNickname={onEditNickname}
      />
    )
    fireEvent.click(screen.getByText(/Edit/i))
    const input = screen.getByDisplayValue("Main")
    fireEvent.change(input, { target: { value: "Updated" } })
    fireEvent.blur(input)
    expect(onEditNickname).toHaveBeenCalledWith("wallet1", "Updated")
  })
}) 