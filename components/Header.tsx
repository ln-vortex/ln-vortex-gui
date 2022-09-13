import Vortex from '../assets/vortex.svg';
import Link from 'next/link';

export default function Header() {
  return (
    <div>
      <Link href="/">
        <a
          className="header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Vortex width="45" height="45" viewBox="0 0 21 25" />
          <span>LN-VORTEX</span>
        </a>
      </Link>
      <br />
    </div>
  );
}
