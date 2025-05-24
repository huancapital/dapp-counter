import { useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import './App.css'

const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FeeCollected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFeeAmount","type":"uint256"}],"name":"FeeSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FeesWithdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"collectedFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dec","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"feeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"inc","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newFeeAmount","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFees","outputs":[],"stateMutability":"nonpayable","type":"function"}]


const CONTRACT_ADDRESS = '0x9E1B3806cf530b31673e453169a58C882AC53951'

function HomePage() {
  const [count, setCount] = useState<number>(0)
  const [wallet, setWallet] = useState<string>('')
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const [bnbBalance, setBnbBalance] = useState<string>('0')
  const [sendingBnb, setSendingBnb] = useState(false)

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

  const sendBnb = async () => {
    if (!contract) return
    setSendingBnb(true)
    try {
      const signer = await contract.signer
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther('0.01')
      })
      await tx.wait()
      // Update BNB balance after sending
      const balance = await signer.provider?.getBalance(await signer.getAddress())
      if (balance) {
        setBnbBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      alert('Failed to send BNB!')
      console.error(error)
    }
    setSendingBnb(false)
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
          <button 
            className="counter-btn" 
            style={{ marginBottom: 16 }} 
            onClick={sendBnb} 
            disabled={!contract || sendingBnb}
          >
            {sendingBnb ? 'Sending...' : 'Send 0.01 BNB'}
          </button>
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
