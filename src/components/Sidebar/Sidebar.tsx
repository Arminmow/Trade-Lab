import styles from "./Sidebar.module.css";

interface SidebarProps {
  onUploadClick: () => void;
}

function Sidebar({ onUploadClick }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <LogoIcon />
        <span className={styles.brandName}>Trade Lab</span>
      </div>

      <nav aria-label="Main">
        <button type="button" className={styles.uploadButton} onClick={onUploadClick}>
          <UploadIcon />
          Upload file
        </button>
      </nav>
    </aside>
  );
}

function LogoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="9" fill="#141B27" />
      <path d="M11 9v18M18 12v14M25 8v17" stroke="#3A475C" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8.5" y="13" width="5" height="9" rx="1" fill="var(--accent)" />
      <rect x="15.5" y="15" width="5" height="8" rx="1" fill="var(--loss)" />
      <rect x="22.5" y="11" width="5" height="10" rx="1" fill="var(--accent)" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
    </svg>
  );
}

export default Sidebar;