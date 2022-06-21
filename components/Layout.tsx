import Header from './Header';

export default function Layout({ children }) {
  return (
    <>
      <div id="wrapper">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
}
