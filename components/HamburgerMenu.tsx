import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import SupportedTransactionTypes from './SupportedTransactionTypes';

const HamburgerMenu = ({ coordinatorName, statusData }) => {
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
        <Links
          closeSideBar={closeSideBar}
          coordinatorName={coordinatorName}
          statusData={statusData}
        />
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

export const Links = ({ closeSideBar, coordinatorName, statusData }) => {
  const router = useRouter();
  const coordinatorNames = statusData.map(function (coordinator) {
    return coordinator[0];
  });
  const [selectedCoordinatorName, setSelectedCoordinatorName] =
    useState(coordinatorName);
  const coordinatorIndex = coordinatorNames.indexOf(selectedCoordinatorName);
  const selectedCoordinator = statusData[coordinatorIndex][1];

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
        value={selectedCoordinatorName}
        onChange={(e) => {
          setSelectedCoordinatorName(e.target.value);
          router.push({
            pathname: '/',
            query: { coordinator: e.target.value },
          });
          closeSideBar();
        }}
        style={{ marginBottom: '24px' }}
      >
        {coordinatorNames.map((coordinator, index) => (
          <option key={index}>{coordinator}</option>
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
      <SupportedTransactionTypes
        coordinator={selectedCoordinator}
        coordinatorName={selectedCoordinatorName}
        onClick={closeSideBar}
      />
    </>
  );
};

export default HamburgerMenu;
