import Vortex from '../assets/vortex.svg';

export default function Header() {
  return (
    <div style={{ fontSize: 30, color: 'white', display: 'flex', flex: 1 }}>
      <Vortex width="45" height="45" viewBox="0 0 21 25" />
      LN-VORTEX
      <br />
      <br />
    </div>
  );
}
