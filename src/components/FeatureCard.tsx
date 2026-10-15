import type { ReactNode } from 'react';

export type FeatureIconName = 'spark' | 'flow' | 'shield';

export type FeatureCardProps = {
  icon: FeatureIconName;
  number: string;
  title: string;
  description: string;
  tag: string;
};

const iconPaths: Record<FeatureIconName, ReactNode> = {
  spark: <><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
  flow: <><rect x="3" y="4" width="7" height="6" rx="2" /><rect x="14" y="14" width="7" height="6" rx="2" /><path d="M10 7h2a3 3 0 0 1 3 3v4" /><path d="m12 12 3 3 3-3" /></>,
  shield: <><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
};

export default function FeatureCard({ icon, number, title, description, tag }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <span className={`feature-icon feature-icon-${icon}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{iconPaths[icon]}</svg>
        </span>
        <span className="feature-number">{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-tag">{tag}</span>
    </article>
  );
}
