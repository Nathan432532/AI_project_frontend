import SearchPage from "./pages/SearchPage";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Header userName="Jan Janssen"/>
      <Routes>
        {/*<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        */}
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  )
}

export default App;