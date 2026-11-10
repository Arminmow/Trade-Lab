import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  hint?: string;
}

function EmptyState({ icon, title, description, action, hint }: EmptyStateProps) {
  return (
    <section className={styles.card}>
      {/* decorative price line in the background */}
      <svg className={styles.chart} viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 170 L70 150 L130 160 L200 110 L270 125 L340 80 L410 100 L480 60 L550 85 L620 40 L700 55 L800 20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeOpacity="0.4" />
        <path d="M0 170 L70 150 L130 160 L200 110 L270 125 L340 80 L410 100 L480 60 L550 85 L620 40 L700 55 L800 20 L800 220 L0 220Z" fill="var(--accent)" fillOpacity="0.05" />
      </svg>

      <div className={styles.content}>
        <div className={styles.iconBox}>{icon}</div>

        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        {action && (
          <button type="button" className={styles.action} onClick={action.onClick}>
            {action.icon}
            {action.label}
          </button>
        )}

        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    </section>
  );
}

export default EmptyState;