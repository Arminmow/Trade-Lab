import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.main}>
        {/* the page matching the current URL renders here */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;