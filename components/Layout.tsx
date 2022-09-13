import Footer from './Footer';
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';

export default function Layout({ children, statusData }) {
  return (
    <>
      <HamburgerMenu statusData={statusData} />
      <div id="wrapper">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
