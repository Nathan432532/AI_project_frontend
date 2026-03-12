import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultPage";
import NotFound from "./pages/NotFoundPage";
import ChoicePage from "./pages/ChoicePage/ChoicePage";
import SearchPageCompany from "./pages/SearchPageCompany";


function App() {
  return (
    <>
      <Header userName="Jan Janssen"/>
      <Routes>
        {/*<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        */}
        <Route path="/keuze" element={<ChoicePage />} />
        <Route path="/search/job" element={<SearchPageCompany />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;