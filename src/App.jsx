import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import QTList from './pages/QTList';
import QTWrite from './pages/QTWrite';
import PrayerDashboard from './pages/PrayerDashboard';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qt" element={<QTList />} />
          <Route path="/qt/new" element={<QTWrite />} />
          <Route path="/qt/:id" element={<QTWrite />} />
          <Route path="/prayers" element={<PrayerDashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
