import './index.css';
const Navbar = () => {

  // Home redirects to the home page
  const redirectToPage = (selection: 'home' | 'about' | 'contact') => {

    const redirectMap = {
      'home' : 'https://www.thepedagogycommunity.org/',
      'about' : 'https://www.thepedagogycommunity.org/about',
      'contact' : 'https://www.thepedagogycommunity.org/contact'
    }

      window.location.href = redirectMap[selection];
  };

  return (
    <div className="navbar">
        <a className="logo" href="https://www.thepedagogycommunity.org/">
            <img src='/cert-site-tpc/headerimage.png' alt="Logo" />
        </a>
        <div className="nav-buttons">
            <button onClick={() => redirectToPage('home')}>Home</button>
        </div>
    </div>
  );
};

export default Navbar;