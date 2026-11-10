import { Routes, Route, Navigate } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import { tabs, defaultTabPath } from "./tabs";

function App() {
  const home = <Navigate to={`/${defaultTabPath}`} replace />;

  return (
    <Routes>
      {/* pathless layout route: wraps every page in the sidebar + main view */}
      <Route element={<DashboardLayout />}>
        <Route index element={home} />
        {tabs.map((tab) => (
          <Route key={tab.path} path={tab.path} element={tab.element} />
        ))}
        <Route path='*' element={home} />
      </Route>
    </Routes>
  );
}

export default App;
