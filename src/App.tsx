import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/public/HomePage'
import ServicesPage from './pages/public/ServicesPage'
import PortfolioPage from './pages/public/PortfolioPage'
import GetQuotePage from './pages/public/GetQuotePage'
import ReviewsPage from './pages/public/ReviewsPage'
import InterestPage from './pages/public/InterestPage'
import ContactPage from './pages/public/ContactPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProjects from './pages/admin/AdminProjects'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminReviews from './pages/admin/AdminReviews'
import AdminServices from './pages/admin/AdminServices'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="get-quote" element={<GetQuotePage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="register-interest" element={<InterestPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
