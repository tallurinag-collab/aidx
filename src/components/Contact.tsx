export default function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-panel">
        <div className="contact-orb contact-orb-one" />
        <div className="contact-orb contact-orb-two" />
        <p className="eyebrow contact-eyebrow"><span className="eyebrow-dot" /> A more human kind of transformation</p>
        <h2 id="contact-title">Ready to make<br />work <span>work better?</span></h2>
        <a className="button button-light" href="#approach">Let's find your next step <span aria-hidden="true">&#8599;</span></a>
        <p className="contact-note">Start with a conversation. Leave with a clearer path forward.</p>
      </div>
    </section>
  );
}
