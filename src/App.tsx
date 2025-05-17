import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/page/:id" element={<Editor />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
