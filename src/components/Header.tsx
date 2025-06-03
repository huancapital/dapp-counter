import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import './Header.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [network, setNetwork] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [wallet, setWallet] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
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

  const connectWallet = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ethWin = window as any;
    if (!ethWin.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }
    
    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(ethWin.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet!');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet('');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
                <span className="pro-badge">PRO</span>
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
            <li className="wallet-section">
              {!wallet ? (
                <button 
                  className="connect-btn"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <span className="connect-icon">🔗</span>
                  <span className="connect-text">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                </button>
              ) : (
                <div className="wallet-info">
                  <div className="wallet-address">
                    <span className="wallet-icon">👤</span>
                    <span className="address-text">
                      {wallet.slice(0, 6)}...{wallet.slice(-4)}
                    </span>
                  </div>
                  <button 
                    className="disconnect-btn"
                    onClick={disconnectWallet}
                    title="Disconnect wallet"
                  >
                    ✕
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}; 