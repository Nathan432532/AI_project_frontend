import Header from "./components/Header/Header";
import { Route, Routes, useLocation } from "react-router-dom";
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


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <Header userName="Jan Janssen" showProfile={!isLoginPage} />
      <Routes>
        {/*<Route path="/" element={<Home />} />*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/keuze" element={<ChoicePage />} />
        <Route path="/search/job" element={<SearchPageJob />} />
        <Route path="/search/company" element={<SearchPageCompany />} />
        <Route path="/results/company" element={<CompanyResultPage />} />
        <Route path="/results/job" element={<JobResultPage />} />
        <Route path="/admin/settings/job" element={<AdminSettingsPageJobs />} />
        <Route path="/admin/settings/company" element={<AdminSettingsPageCompany />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/saved" element={<SavedResultsPage />} />
      </Routes>
    </>
  )
}

export default App;