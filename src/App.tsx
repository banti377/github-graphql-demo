import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StateProvider } from "./context/State";
import Home from "./pages/Home";
import Issues from "./pages/Issues";

const App: FC = () => {
  return (
    <StateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues" element={<Issues />} />
        </Routes>
      </Router>
    </StateProvider>
  );
};

export default App;
