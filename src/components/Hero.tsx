function SystemPreview() {
  return (
    <div className="preview-shell" aria-label="Illustration of an AI workflow dashboard">
      <div className="preview-glow" />
      <div className="preview-card">
        <div className="preview-topbar">
          <div className="preview-brand"><span className="mini-mark">&#10033;</span> AIDX workspace</div>
          <span className="live-status"><i /> Live system</span>
        </div>
        <div className="preview-body">
          <div className="preview-greeting">
            <span className="eyebrow">MONDAY, 9:41 AM</span>
            <h2>Your work, in motion.</h2>
            <p>Three intelligent systems are moving your priorities forward.</p>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon violet">&#10033;</span>
              <span className="activity-copy"><strong>Customer insight brief</strong><small>Research agent - Synthesized 18 sources</small></span>
              <span className="activity-check">&#10003;</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon blue">&#8599;</span>
              <span className="activity-copy"><strong>Pipeline summary ready</strong><small>Data assistant - Updated 4 minutes ago</small></span>
              <span className="activity-check">&#10003;</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon peach">&#8984;</span>
              <span className="activity-copy"><strong>Team requests organized</strong><small>Operations agent - 6 items prioritized</small></span>
              <span className="activity-progress"><i /></span>
            </div>
          </div>
          <div className="preview-bottom">
            <span className="avatar-stack"><i>J</i><i>M</i><i>A</i><b>+4</b></span>
            <span>Working with your team</span>
            <span className="bottom-sparkle">&#10022;</span>
          </div>
        </div>
      </div>
      <div className="float-note"><span>&#10022;</span><div><strong>Human-led. AI-powered.</strong><small>Built to work together.</small></div></div>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> AI for the way work really works</p>
        <h1 id="hero-title">Make room for <span>what's next.</span></h1>
        <p className="hero-description">We help ambitious teams turn AI from a big idea into better everyday work - with practical tools, thoughtful design, and people at the center.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">Explore what's possible <span aria-hidden="true">&#8599;</span></a>
          <a className="text-link" href="#platform"><span className="play-icon" aria-hidden="true">&#9654;</span> See how it works</a>
        </div>
        <div className="hero-caption"><span className="caption-line" /> Less busywork. More meaningful progress.</div>
      </div>
      <SystemPreview />
    </section>
  );
}
