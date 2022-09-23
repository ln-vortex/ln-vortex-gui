import Vortex from '../assets/vortex.svg';
import Link from 'next/link';
import Head from 'next/head'

export default function Header({ coordinatorName }) {
  return (
    <>
    <Head>
      <title> {`Vortex | ${coordinatorName}`} </title>
    </Head>
    <div>
      <Link href={`/?coordinator=${coordinatorName}`}>
        <a
          className="header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Vortex width="45" height="45" viewBox="0 0 21 25" />
          <span>VORTEX</span>
        </a>
      </Link>
      <br />
    </div>
    </>
  );
}
