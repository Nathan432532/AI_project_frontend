import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFoundPage";
import ChoicePage from "./pages/ChoicePage/ChoicePage";
import SearchPageCompany from "./pages/SearchPageCompany";
import JobResultPage from "./pages/ResultPageJob";
import CompanyResultPage from "./pages/ResultPageCompany/CompanyResultPage";


function App() {
  return (
    <>
      <Header userName="Jan Janssen"/>
      <Routes>
        {/*<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        */}
        <Route path="/keuze" element={<ChoicePage />} />
        <Route path="/search/company" element={<SearchPageCompany />} />
        <Route path="/results/company" element={<CompanyResultPage />} />
        <Route path="/results/job" element={<JobResultPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;