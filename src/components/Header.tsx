import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import './Header.css';

type TransactionFilter = 'all' | 'incoming' | 'outgoing';

const CONTRACT_ADDRESS = '0xbc64a90a919c0b9102f477056a3403b2b0a74976';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('all');
  const [network, setNetwork] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkNetwork = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ethWin = window as any;
      if (ethWin.ethereum) {
        const provider = new ethers.BrowserProvider(ethWin.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network.name);
      }
    };
    checkNetwork();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-menu') && !target.closest('.menu-button')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <div className="logo-content">
                <span className="logo-icon">🔢</span>
                <span className="logo-text">BNW Counter</span>
              </div>
            </Link>
          </div>
          {network && (
            <div className="network-badge">
              <span className="network-dot"></span>
              <span className="network-name">{network}</span>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className={`menu-button ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>

        {/* Navigation menu */}
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={closeMenu}>
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Homepage</span>
                {location.pathname === '/' && <span className="active-indicator"></span>}
              </Link>
            </li>
            <li className={location.pathname === '/transactions' ? 'active' : ''}>
              <div className="transactions-menu">
                <Link to="/transactions" onClick={closeMenu}>
                  <span className="nav-icon">📜</span>
                  <span className="nav-text">Transaction History</span>
                  {location.pathname === '/transactions' && <span className="active-indicator"></span>}
                </Link>
                <div className="filter-dropdown">
                  <select 
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value as TransactionFilter)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="all">All Transactions</option>
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                </div>
              </div>
            </li>
            <li className="contract-address">
              <div className="contract-address-container">
                <span className="contract-label">Contract:</span>
                <code className="address">{CONTRACT_ADDRESS}</code>
                <button 
                  className={`copy-button ${isCopied ? 'copied' : ''}`}
                  onClick={copyContractAddress}
                  title="Copy contract address"
                >
                  <span className="copy-icon">{isCopied ? '✓' : '📋'}</span>
                  <span className="copy-tooltip">{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}; 