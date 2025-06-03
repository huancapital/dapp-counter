import { useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import './App.css'

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "inc",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dec",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeeCollected",
    "type": "event"
  }
]
const CONTRACT_ADDRESS = '0x444e8B26b69558986c7530A9EA751F6Dbe74F9A3'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface Transaction {
  id: string
  type: 'increment' | 'decrement' | 'fee_collected'
  user: string
  amount?: string
  count?: number
  timestamp: Date
  txHash?: string
}

function HomePage() {
  const [count, setCount] = useState<number>(0)
  const [wallet, setWallet] = useState<string>('')
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const [bnbBalance, setBnbBalance] = useState<string>('0')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    setTransactions(prev => [newTransaction, ...prev].slice(0, 20)) // Keep last 20 transactions
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

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
    
    // Set up event listener for FeeCollected
    ctr.on('FeeCollected', (user: string, amount: bigint) => {
      console.log('Fee collected:', { user, amount: ethers.formatEther(amount) })
      const feeAmount = ethers.formatEther(amount)
      
      // Add to transaction history
      addTransaction({
        type: 'fee_collected',
        user,
        amount: feeAmount,
        timestamp: new Date()
      })
      
      showToast(`Fee collected: ${feeAmount} tBNB from ${user.slice(0, 6)}...${user.slice(-4)}`, 'success')
    })
    
    // Fetch initial count
    const c = await ctr.get()
    setCount(Number(c))
    // Fetch BNB balance
    const balance = await ethProvider.getBalance(address)
    setBnbBalance(ethers.formatEther(balance))
    showToast('Wallet connected successfully!', 'success')
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
      showToast('Transaction submitted...', 'info')
      const tx = await contract.inc({
        value: ethers.parseEther('0.001') // Send 0.001 tBNB fee
      })
      await tx.wait()
      const newCount = count + 1
      await updateCount()
      
      // Add to transaction history
      addTransaction({
        type: 'increment',
        user: wallet,
        amount: '0.001',
        count: newCount,
        timestamp: new Date(),
        txHash: tx.hash
      })
      
      showToast('Counter incremented successfully!', 'success')
    } catch {
      showToast('Transaction failed!', 'error')
    }
    setLoading(false)
  }

  const handleSub = async () => {
    if (!contract) return
    setLoading(true)
    try {
      showToast('Transaction submitted...', 'info')
      const tx = await contract.dec({
        value: ethers.parseEther('0.001') // Send 0.001 tBNB fee
      })
      await tx.wait()
      const newCount = count - 1
      await updateCount()
      
      // Add to transaction history
      addTransaction({
        type: 'decrement',
        user: wallet,
        amount: '0.001',
        count: newCount,
        timestamp: new Date(),
        txHash: tx.hash
      })
      
      showToast('Counter decremented successfully!', 'success')
    } catch {
      showToast('Transaction failed!', 'error')
    }
    setLoading(false)
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'increment': return '➕'
      case 'decrement': return '➖'
      case 'fee_collected': return '💰'
      default: return '📝'
    }
  }

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'increment': return '#4CAF50'
      case 'decrement': return '#FF5722'
      case 'fee_collected': return '#FFD700'
      default: return '#2196F3'
    }
  }

  return (
    <div className="page-container">
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              minWidth: '250px',
              backgroundColor: 
                toast.type === 'success' ? '#4CAF50' :
                toast.type === 'error' ? '#F44336' : '#2196F3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

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
            setTransactions([]);
            showToast('Wallet disconnected', 'info');
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
      
      {/* Transaction History */}
      {transactions.length > 0 && (
        <div style={{
          marginTop: 32,
          maxWidth: '800px',
          width: '100%'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(162, 89, 255, 0.1), rgba(100, 108, 255, 0.05))',
            border: '1px solid rgba(162, 89, 255, 0.2)',
            borderRadius: '20px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '1.8rem' }}>📊</span>
              Recent Transactions
              <span style={{
                background: 'linear-gradient(45deg, #a259ff, #646cff)',
                color: 'white',
                fontSize: '0.8rem',
                padding: '4px 12px',
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {transactions.length}
              </span>
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {transactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(162, 89, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getTransactionColor(tx.type)}, ${getTransactionColor(tx.type)}80)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: `0 4px 12px ${getTransactionColor(tx.type)}40`
                    }}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div style={{
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '4px'
                      }}>
                        {tx.type === 'increment' ? 'Counter Incremented' :
                         tx.type === 'decrement' ? 'Counter Decremented' :
                         'Fee Collected'}
                      </div>
                      <div style={{
                        color: '#cccccc',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace'
                      }}>
                        {tx.user.slice(0, 8)}...{tx.user.slice(-6)}
                        {tx.count !== undefined && (
                          <span style={{ marginLeft: '8px', color: getTransactionColor(tx.type) }}>
                            → {tx.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    {tx.amount && (
                      <div style={{
                        color: getTransactionColor(tx.type),
                        fontWeight: '700',
                        fontSize: '1rem',
                        marginBottom: '4px'
                      }}>
                        {tx.amount} tBNB
                      </div>
                    )}
                    <div style={{
                      color: '#888',
                      fontSize: '0.8rem'
                    }}>
                      {tx.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {transactions.length > 10 && (
              <div style={{
                textAlign: 'center',
                marginTop: '16px',
                color: '#cccccc',
                fontSize: '0.9rem'
              }}>
                Showing 10 of {transactions.length} transactions
              </div>
            )}
          </div>
        </div>
      )}
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
