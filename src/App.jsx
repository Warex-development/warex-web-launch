import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import LaunchBanner from './components/LaunchBanner'
import LaunchingSoonPage from './pages/public/LaunchingSoonPage'

// Public Pages
import HomePage from './pages/public/HomePage'
import HowItWorksPage from './pages/public/HowItWorksPage'
import WhyWareXhubPage from './pages/public/WhyWareXhubPage'
import MembershipPage from './pages/public/MembershipPage'
import IndustriesPage from './pages/public/IndustriesPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import FAQPage from './pages/public/FAQPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsOfServicePage from './pages/public/TermsOfServicePage'
import LoginPage from './pages/auth/LoginPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Member Dashboard
import MemberLayout from './layouts/MemberLayout'
import MemberHome from './pages/member/MemberHome'
import SearchPage from './pages/member/SearchPage'
import RequestQuotePage from './pages/member/RequestQuotePage'
import MyRequestsPage from './pages/member/MyRequestsPage'
import MyInventoryPage from './pages/member/MyInventoryPage'
import AddListingPage from './pages/member/AddListingPage'
import PendingReviewsPage from './pages/member/PendingReviewsPage'
import BulkUploadPage from './pages/member/BulkUploadPage'
import SubscriptionPage from './pages/member/SubscriptionPage'
import NotificationsPage from './pages/member/NotificationsPage'
import ProfilePage from './pages/member/ProfilePage'

// Admin Dashboard
import AdminLayout from './layouts/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import PendingQueuePage from './pages/admin/PendingQueuePage'
import ApprovedInventoryPage from './pages/admin/ApprovedInventoryPage'
import BuyerRequestsAdminPage from './pages/admin/BuyerRequestsAdminPage'
import MatchingEnginePage from './pages/admin/MatchingEnginePage'
import DealsPipelinePage from './pages/admin/DealsPipelinePage'
import RevenueTrackerPage from './pages/admin/RevenueTrackerPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import CommissionAnalyticsPage from './pages/admin/CommissionAnalyticsPage'
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage'
import AdminLeadsPage from './pages/admin/AdminLeadsPage'
import MembershipRequestsPage from './pages/admin/MembershipRequestsPage'

// Public Layout
import PublicLayout from './layouts/PublicLayout'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function PublicOnly({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated) {
    if (user?.role === 'admin' || user?.role === 'reviewer') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target.closest('a, button');
      if (!el) return;

      const isLink = el.tagName === 'A';
      const href = el.getAttribute('href');

      // Don't intercept if already on the launching-soon page or if it's the "Back to Site" button
      if (window.location.pathname === '/launching-soon') return;

      if (isLink && href) {
        const actionPaths = ['/login', '/register', '/dashboard', '/admin', '/listings', '/inventory', '/contact'];
        if (actionPaths.some(p => href.startsWith(p))) {
          e.preventDefault();
          e.stopPropagation();
          navigate('/launching-soon');
          return;
        }
      }

      if (!isLink) {
        const text = el.textContent || '';
        if (/get started|join now|submit|sign in|register|login/i.test(text)) {
          // If it's a button, check if it's not the one on the launching-soon page
          if (el.closest('.launch-modal-container')) return; // just in case
          e.preventDefault();
          e.stopPropagation();
          navigate('/launching-soon');
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [navigate]);

  return (
    <>
      <style>{`
        body { padding-top: 56px; }
        nav.fixed { top: 56px !important; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 30s linear infinite;
        }
      `}</style>
      <LaunchBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/why-warexhub" element={<WhyWareXhubPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        <Route path="/launching-soon" element={<LaunchingSoonPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/admin/login" element={<PublicOnly><AdminLoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

        {/* Member Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['member']}>
            <MemberLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MemberHome />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="request-quote" element={<RequestQuotePage />} />
          <Route path="my-requests" element={<MyRequestsPage />} />
          <Route path="inventory" element={<MyInventoryPage />} />
          <Route path="add-listing" element={<AddListingPage />} />
          <Route path="pending-reviews" element={<PendingReviewsPage />} />
          <Route path="bulk-upload" element={<BulkUploadPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin / Reviewer Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'reviewer']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminHome />} />
          <Route path="pending-queue" element={<PendingQueuePage />} />
          <Route path="approved-inventory" element={<ApprovedInventoryPage />} />
          <Route path="buyer-requests" element={<BuyerRequestsAdminPage />} />
          <Route path="matching-engine" element={<MatchingEnginePage />} />
          <Route path="deals-pipeline" element={<DealsPipelinePage />} />
          <Route path="revenue" element={<RevenueTrackerPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="commission" element={<CommissionAnalyticsPage />} />
          <Route path="registrations" element={<AdminRegistrationsPage />} />
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="membership-requests" element={<MembershipRequestsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
