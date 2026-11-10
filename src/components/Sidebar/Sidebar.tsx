import { NavLink } from "react-router";
import { tabs } from "../../tabs";
import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <LogoIcon />
        <span className={styles.brandName}>Trade Lab</span>
      </div>

      <nav className={styles.nav} aria-label="Main">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`/${tab.path}`}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
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

export default Sidebar;