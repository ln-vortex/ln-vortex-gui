import Github from '../assets/github.svg';

export default function Footer() {
  return (
    <div id="footer">
      <a
        href="https://github.com/ln-vortex/ln-vortex/blob/master/docs/ProtocolDocumentation.md"
        target="_blank"
        rel="noopener noreferrer"
        className="small-text"
        style={{ float: 'left' }}
      >
        ProtocolDocumentation.md
      </a>
      <a
        href="https://github.com/ln-vortex"
        target="_blank"
        rel="noopener noreferrer"
        style={{ float: 'right' }}
      >
        <Github width="24" height="24" viewBox="0 0 24 24" />
      </a>
      <div style={{ clear: 'both' }}></div>
      <br />
    </div>
  );
}
