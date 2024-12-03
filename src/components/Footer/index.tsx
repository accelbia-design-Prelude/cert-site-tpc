import './index.css';
// SVG component
const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        {/* Three columns, first having sitemap, second having home page references, third having brand logo */}
        <div className="footer-column">
          <ul>
            <li>Home</li>
            <li>Services</li>
            <li>Products</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
          <div className="logo">
            <img src="./White.svg" alt="logo" width="60%"/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;