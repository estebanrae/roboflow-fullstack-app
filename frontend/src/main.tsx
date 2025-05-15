import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import Landing from './pages/Landing';
import Pantry from './pages/Pantry';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Landing />} />
      <Route path="pantry/:id" element={<Pantry />} />
    </Routes>
  </BrowserRouter>,
)
