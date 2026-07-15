import { Routes, Route } from "react-router-dom";
import { Home, Applied, Saved } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/applied" element={<Applied />} />
    </Routes>
  );
}
