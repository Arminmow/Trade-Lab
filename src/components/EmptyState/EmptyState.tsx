import { useRef, type ChangeEvent, type ReactNode } from "react";
import { UploadIcon } from "../../icons";
import styles from "./EmptyState.module.css";

const ACCEPTED_EXTENSIONS = [".csv", ".htm", ".html"];

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  onFileSelect?: (file: File) => void;
}

function EmptyState({ icon, title, description, onFileSelect }: EmptyStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect?.(file);
    e.target.value = ""; // lets the user pick the same file again
  };

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

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleChange}
          hidden
        />
        <button type="button" className={styles.uploadButton} onClick={() => inputRef.current?.click()}>
          <UploadIcon />
          Upload file
        </button>

        <span className={styles.hint}>{ACCEPTED_EXTENSIONS.join(" · ")}</span>
      </div>
    </section>
  );
}

export default EmptyState;