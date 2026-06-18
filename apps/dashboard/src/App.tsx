import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Sessions from './pages/Sessions';
import Heatmap from './pages/Heatmap';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/sessions" replace />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="heatmap" element={<Heatmap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
