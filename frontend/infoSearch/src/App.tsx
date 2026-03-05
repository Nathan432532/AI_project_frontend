import SearchPage from "./pages/SearchPage";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultPage";
import NotFound from "./pages/NotFoundPage";


function App() {
  return (
    <>
      <Header userName="Jan Janssen"/>
      <Routes>
        {/*<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;