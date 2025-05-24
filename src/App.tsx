import { useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import './App.css'

const CONTRACT_ABI = [
  {"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"dec","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"inc","outputs":[],"stateMutability":"nonpayable","type":"function"}
]

const CONTRACT_ADDRESS = '0xbc64a90a919c0b9102f477056a3403b2b0a74976'

function HomePage() {
  const [count, setCount] = useState<number>(0)
  const [wallet, setWallet] = useState<string>('')
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const [bnbBalance, setBnbBalance] = useState<string>('0')

  const connectWallet = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ethWin = window as any
    if (!ethWin.ethereum) {
      alert('MetaMask is not installed!')
      return
    }
    const ethProvider = new ethers.BrowserProvider(ethWin.ethereum)
    await ethProvider.send('eth_requestAccounts', [])
    const signer = await ethProvider.getSigner()
    const address = await signer.getAddress()
    setWallet(address)
    const ctr = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    setContract(ctr)
    // Fetch initial count
    const c = await ctr.get()
    setCount(Number(c))
    // Fetch BNB balance
    const balance = await ethProvider.getBalance(address)
    setBnbBalance(ethers.formatEther(balance))
  }

  const updateCount = async () => {
    if (!contract) return
    const c = await contract.get()
    setCount(Number(c))
  }

  const handleAdd = async () => {
    if (!contract) return
    setLoading(true)
    try {
      const tx = await contract.inc()
      await tx.wait()
      await updateCount()
    } catch {
      alert('Transaction failed!')
    }
    setLoading(false)
  }

  const handleSub = async () => {
    if (!contract) return
    setLoading(true)
    try {
      const tx = await contract.dec()
      await tx.wait()
      await updateCount()
    } catch {
      alert('Transaction failed!')
    }
    setLoading(false)
  }

  return (
    <div className="page-container">
      {!wallet ? (
        <button className="counter-btn" onClick={connectWallet} style={{ marginBottom: 24 }}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div style={{ marginBottom: 4 }}>Wallet: {wallet.slice(0, 6)}...{wallet.slice(-4)}</div>
          <div style={{ marginBottom: 16 }}>tBNB Balance: {bnbBalance}</div>
          <button className="counter-btn" style={{ marginBottom: 16 }} onClick={() => {
            setWallet('');
            setContract(null);
            setBnbBalance('0');
          }}>
            Disconnect
          </button>
        </>
      )}
      <div className="counter-container">
        <button className="counter-btn left" onClick={handleSub} disabled={!contract || loading}>
          Sub
        </button>
        <span className="counter-value">{count}</span>
        <button className="counter-btn right" onClick={handleAdd} disabled={!contract || loading}>
          Add
        </button>
      </div>
      {loading && <div style={{ marginTop: 16 }}>Waiting for transaction...</div>}
    </div>
  )
}

function TransactionHistory() {
  return (
    <div className="page-container">
      <h1>Transaction History</h1>
      {/* Transaction history content will be implemented here */}
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
