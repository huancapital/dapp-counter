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
              <div className="footer-logo-content">
                <span className="footer-logo-icon">🔢</span>
                <span className="footer-logo-text">BNW Counter</span>
                <span className="footer-pro-badge">PRO</span>
              </div>
            </Link>
            <p className="footer-description">
              A premium decentralized counter application built on the BNB Smart Chain with advanced features and professional UI.
            </p>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Decentralized</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0.001</span>
                <span className="stat-label">tBNB Fee</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">🏠 Home</Link></li>
              <li><a href="https://testnet.bscscan.com/address/0xbc64a90a919c0b9102f477056a3403b2b0a74976" target="_blank" rel="noopener noreferrer">🔍 View on BscScan</a></li>
              <li><a href="#" className="premium-link">⭐ Premium Features</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-links">
            <h3>Resources</h3>
            <ul>
              <li><a href="https://docs.bnbchain.org/" target="_blank" rel="noopener noreferrer">📚 BNB Chain Docs</a></li>
              <li><a href="https://testnet.bnbchain.org/" target="_blank" rel="noopener noreferrer">🧪 BNB Testnet</a></li>
              <li><a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">🦊 MetaMask</a></li>
              <li><a href="#" className="premium-link">💎 Pro Support</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <span className="social-icon">📦</span>
                <span className="social-label">GitHub</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
                <span className="social-icon">🐦</span>
                <span className="social-label">Twitter</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Discord">
                <span className="social-icon">💬</span>
                <span className="social-label">Discord</span>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link premium-social" title="Telegram Pro">
                <span className="social-icon">✈️</span>
                <span className="social-label">Telegram Pro</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} BNW Counter PRO. All rights reserved.
            <span className="pro-indicator">✨ Premium Edition</span>
          </div>
          <div className="footer-legal">
            <a href="#" className="legal-link">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#" className="legal-link">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#" className="legal-link premium-link">Pro License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 