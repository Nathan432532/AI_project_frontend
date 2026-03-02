import SearchPage from "./pages/SearchPage";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultPage";


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
      </Routes>
    </>
  )
}

export default App;