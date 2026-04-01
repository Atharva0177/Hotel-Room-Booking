import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageLayout } from './components/layout/PageLayout';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AmenitiesPage } from './pages/AmenitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminRooms } from './pages/admin/AdminRooms';
import { AdminGuests } from './pages/admin/AdminGuests';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAmenities } from './pages/admin/AdminAmenities';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminAbout } from './pages/admin/AdminAbout';

const Page = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children, admin = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return children;
};

const NotFound = () => (
  <section className="py-20 text-center">
    <h1 className="font-display text-6xl text-gold">404</h1>
    <p className="mt-2">The page you are looking for does not exist.</p>
  </section>
);

function App() {
  const location = useLocation();

  return (
    <PageLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><HomePage /></Page>} />
          <Route path="/rooms" element={<Page><RoomsPage /></Page>} />
          <Route path="/rooms/:slug" element={<Page><RoomDetailPage /></Page>} />
          <Route path="/booking/:roomId" element={<ProtectedRoute><Page><BookingPage /></Page></ProtectedRoute>} />
          <Route path="/booking/confirmation/:bookingCode" element={<ProtectedRoute><Page><BookingConfirmationPage /></Page></ProtectedRoute>} />
          <Route path="/login" element={<Page><LoginPage /></Page>} />
          <Route path="/register" element={<Page><RegisterPage /></Page>} />
          <Route path="/profile" element={<ProtectedRoute><Page><ProfilePage /></Page></ProtectedRoute>} />
          <Route path="/amenities" element={<Page><AmenitiesPage /></Page>} />
          <Route path="/gallery" element={<Page><GalleryPage /></Page>} />
          <Route path="/contact" element={<Page><ContactPage /></Page>} />
          <Route path="/about" element={<Page><AboutPage /></Page>} />
          <Route path="/admin" element={<ProtectedRoute admin><Page><AdminDashboard /></Page></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute admin><Page><AdminBookings /></Page></ProtectedRoute>} />
          <Route path="/admin/rooms" element={<ProtectedRoute admin><Page><AdminRooms /></Page></ProtectedRoute>} />
          <Route path="/admin/guests" element={<ProtectedRoute admin><Page><AdminGuests /></Page></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute admin><Page><AdminSettings /></Page></ProtectedRoute>} />
          <Route path="/admin/amenities" element={<ProtectedRoute admin><Page><AdminAmenities /></Page></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute admin><Page><AdminGallery /></Page></ProtectedRoute>} />
          <Route path="/admin/about" element={<ProtectedRoute admin><Page><AdminAbout /></Page></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </PageLayout>
  );
}

export default App;
