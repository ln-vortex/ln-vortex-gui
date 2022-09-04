import Footer from './Footer';
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <>
      <HamburgerMenu />
      <div id="wrapper">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
