import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';

const HamburgerMenu = () => {
  const [isOpen, setOpen] = useState(false);

  const handleIsOpen = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  return (
    <div>
      <Menu
        customBurgerIcon={<HamburgerIcon />}
        width="auto"
        isOpen={isOpen}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
      >
        <Links closeSideBar={closeSideBar} />
      </Menu>
    </div>
  );
};

const HamburgerIcon = () => (
  <div>
    <svg
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 22 22"
      stroke="white"
    >
      <path d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </div>
);

export const Links = ({ closeSideBar }) => {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          color: 'white',
          marginBottom: '12px',
        }}
      >
        Transaction Type:
      </div>
      <Link href="/">
        <a
          onClick={closeSideBar}
          className={router.pathname == '/' ? 'current-action' : 'actions'}
        >
          Vortex channel open
        </a>
      </Link>
      <Link href="/collaborativetransaction">
        <a
          onClick={closeSideBar}
          className={
            router.pathname == '/collaborativetransaction'
              ? 'current-action'
              : 'actions'
          }
        >
          Collaborative transaction
        </a>
      </Link>
    </>
  );
};

export default HamburgerMenu;
