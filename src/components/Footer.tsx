export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a className="brand footer-brand" href="#top" aria-label="AIDX, back to top">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>AIDX</span>
        </a>
        <p>AI driven digital transformation, with people at the center.</p>
        <span className="copyright">&copy; {new Date().getFullYear()} AIDX</span>
      </div>
    </footer>
  );
}
