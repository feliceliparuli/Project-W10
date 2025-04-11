import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Details from "./components/Details";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dettagli/:city" element={<Details />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
