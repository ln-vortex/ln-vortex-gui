import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';

const HamburgerMenu = ({ statusData }) => {
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
        <Links closeSideBar={closeSideBar} statusData={statusData} />
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

export const Links = ({ closeSideBar, statusData }) => {
  const router = useRouter();
  const [selectedCoordinatorIndex, setSelectedCoordinatorIndex] = useState(0);
  const selectedCoordinator = statusData[selectedCoordinatorIndex][1];

  return (
    <>
      <div
        style={{
          color: 'white',
          marginBottom: '6px',
        }}
      >
        Coordinator:
      </div>
      <select
        name="coordinators"
        id="coordinators"
        onChange={(e) => {
          setSelectedCoordinatorIndex(e.target.selectedIndex);
        }}
        style={{ marginBottom: '24px' }}
      >
        {statusData.map((coordinator, index) => (
          <option key={index}>{coordinator[0]}</option>
        ))}
      </select>
      <div
        style={{
          color: 'white',
          marginBottom: '6px',
        }}
      >
        Supported Transaction Types:
      </div>
      {selectedCoordinator.transactionTypes?.includes('ChannelOpen') && (
        <Link href="/">
          <a
            onClick={closeSideBar}
            className={router.pathname == '/' ? 'current-action' : 'actions'}
          >
            Vortex channel open
          </a>
        </Link>
      )}
      {selectedCoordinator.transactionTypes?.includes('OnChain') && (
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
      )}
    </>
  );
};

export default HamburgerMenu;
