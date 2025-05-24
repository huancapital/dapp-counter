import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">🔢</span>
              <span className="footer-logo-text">BNW Counter</span>
            </Link>
            <p className="footer-description">
              A decentralized counter application built on the BNB Smart Chain.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/transactions">Transaction History</Link></li>
              <li><a href="https://testnet.bscscan.com/address/0xbc64a90a919c0b9102f477056a3403b2b0a74976" target="_blank" rel="noopener noreferrer">View on BscScan</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-links">
            <h3>Resources</h3>
            <ul>
              <li><a href="https://docs.bnbchain.org/" target="_blank" rel="noopener noreferrer">BNB Chain Docs</a></li>
              <li><a href="https://testnet.bnbchain.org/" target="_blank" rel="noopener noreferrer">BNB Testnet</a></li>
              <li><a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <span className="social-icon">📦</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Discord">
                <span className="social-icon">💬</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} BNW Counter. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#" className="legal-link">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#" className="legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 