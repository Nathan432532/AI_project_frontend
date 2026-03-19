import { useLocation, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header/Header";
import NotFound from "./pages/NotFoundPage";
import ChoicePage from "./pages/ChoicePage/ChoicePage";
import JobResultPage from "./pages/ResultPages/ResultPageJob";
import CompanyResultPage from "./pages/ResultPages/ResultPageCompany/CompanyResultPage";
import SearchPageJob from "./pages/SearchPages/SearchPageJob";
import SearchPageCompany from "./pages/SearchPages/SearchPageCompany/SearchPageCompany";
import SavedResultsPage from "./pages/SavedResultsPage/SavedResultsPage";
import AdminSettingsPageCompany from "./pages/AdminPage/AdminPageCompany/AdminSettingsPage";
import AdminSettingsPageJobs from "./pages/AdminPage/AdminPageJobs/AdminSettingsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";

// ── Inner app (heeft toegang tot AuthContext) ─────────────────────────────────

function AppInner() {
  const location = useLocation();
  const { user } = useAuth();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <Header
        userName={user?.userName ?? "Gebruiker"}
        showProfile={!isLoginPage}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/keuze" element={<ChoicePage />} />
        <Route path="/search/job" element={<SearchPageJob />} />
        <Route path="/search/company" element={<SearchPageCompany />} />
        <Route path="/results/company" element={<CompanyResultPage />} />
        <Route path="/results/job" element={<JobResultPage />} />
        <Route path="/admin/settings/job" element={<AdminSettingsPageJobs />} />
        <Route path="/admin/settings/company" element={<AdminSettingsPageCompany />} />
        <Route path="/saved" element={<SavedResultsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// ── Root app (wikkelt alles in AuthProvider) ──────────────────────────────────

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
