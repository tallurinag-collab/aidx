import FeatureCard, { type FeatureCardProps } from './FeatureCard';

const features: FeatureCardProps[] = [
  {
    icon: 'spark',
    number: '01',
    title: 'AI that feels useful',
    description: 'Bring the right intelligence into the moments that matter, so your people can spend more time on work that moves things forward.',
    tag: 'Human-centered AI',
  },
  {
    icon: 'flow',
    number: '02',
    title: 'Workflows that flow',
    description: 'Connect tools, teams, and information into calmer processes that keep the busywork moving and the big picture in view.',
    tag: 'Connected operations',
  },
  {
    icon: 'shield',
    number: '03',
    title: 'Progress you can trust',
    description: 'Build with clear guardrails, thoughtful oversight, and outcomes you can actually see at every step of the journey.',
    tag: 'Responsible by design',
  },
];

export default function Features() {
  return (
    <section className="section features-section" id="platform" aria-labelledby="features-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A smarter way forward</p>
            <h2 id="features-title">Technology should make<br /><span>work feel more human.</span></h2>
          </div>
          <p className="section-intro">Transformation isn't a tool you switch on. It's a better way to bring people, process, and technology together.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => <FeatureCard key={feature.number} {...feature} />)}
        </div>
      </div>
    </section>
  );
}
