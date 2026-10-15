type WorkflowStep = {
  number: string;
  title: string;
  text: string;
};

const steps: WorkflowStep[] = [
  { number: '01', title: 'Start with people', text: 'Find the friction your team feels every day.' },
  { number: '02', title: 'Design for impact', text: 'Shape a practical solution around real needs.' },
  { number: '03', title: 'Learn and grow', text: 'Measure what changes, then build on it.' },
];

export default function Workflow() {
  return (
    <section className="section approach-section" id="approach" aria-labelledby="approach-title">
      <div className="container approach-layout">
        <div className="approach-heading" id="about">
          <p className="eyebrow">Our approach</p>
          <h2 id="approach-title">Progress, made <span>practical.</span></h2>
          <p>Big change gets easier when you make the next right move clear. We help you start where you are and build momentum from there.</p>
          <a className="underlined-link" href="#contact">A little more about AIDX <span aria-hidden="true">&#8599;</span></a>
        </div>
        <div className="steps-list">
          {steps.map((step) => (
            <article className="step-row" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
              <span className="step-arrow" aria-hidden="true">&#8599;</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
