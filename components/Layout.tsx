import Footer from './Footer';
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';

export default function Layout({ children, coordinatorName, statusData }) {
  return (
    <>
      <HamburgerMenu
        coordinatorName={coordinatorName}
        statusData={statusData}
      />
      <div id="wrapper">
        <Header coordinatorName={coordinatorName} />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
