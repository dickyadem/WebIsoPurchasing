import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const loyaltyLinks = ["Loyalty Program", "Discounts", "Earn 50 Points"];
const quickLinks = ["Our Story", "Track Order", "FAQs", "Contact Us"];
const legalLinks = ["Private Policy", "Terms of Service", "Refund Policy"];

const CatalogFooter = ({ shopLinks = [] }) => {
  return (
    <footer className="catalog-footer">
      <div className="catalog-footer-inner">
        <div className="catalog-footer-grid">
          <div className="catalog-footer-contact">
            <p className="catalog-footer-phone">121-737-2272</p>
            <p><a href="#live-chat">Live Chat</a></p>
            <p><a href="#message">Message Us</a></p>
            <div className="catalog-footer-socials">
              <a href="#instagram" aria-label="Instagram"><FaInstagram /></a>
              <a href="#youtube" aria-label="YouTube"><FaYoutube /></a>
              <a href="#facebook" aria-label="Facebook"><FaFacebookF /></a>
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              {shopLinks.map((label) => (
                <li key={label}>
                  <a className="catalog-footer-shop-link" href={`#${label}`}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Loyalty</h5>
            <ul>
              {loyaltyLinks.map((label) => (
                <li key={label}><a href={`#${label.toLowerCase().replace(" ", "-")}`}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Quick Links</h5>
            <ul>
              {quickLinks.map((label) => (
                <li key={label}><a href={`#${label.toLowerCase().replace(" ", "-")}`}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Download App</h5>
            <div className="catalog-footer-apps">
              <a href="#app-store">Download in AppStore</a>
              <a href="#google-play">Get It On Google Play</a>
            </div>
          </div>
        </div>
        <div className="catalog-footer-legal">
          {legalLinks.map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(" ", "-")}`}>{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default CatalogFooter;
