import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useApplyTheme } from './hooks/useApplyTheme';
import { useSettingsStore } from './store/useSettingsStore';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BrandPage from './pages/BrandPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  useApplyTheme();
  const lang = useSettingsStore((s) => s.language);

  // 同步 <html lang> 与 document.title
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const title = lang === 'zh' ? 'BrandPrice · 海外小众品牌查价' : 'BrandPrice · Niche Brand Price Lookup';
    document.title = title;
  }, [lang]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/brand/:slug" element={<BrandPage />} />
        <Route path="/product/:sku" element={<ProductDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
