import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Interior from "./pages/interior";
import ModelMaking from "./pages/modelMaking";
import Home from "./pages/Home";
import PanoramaGallery from "./components/Panaroma-gallery";
import PanoramaViewer from "./components/PanaromaViewer";
import { useSmoothScroll } from "./hook/useSmoothScroll";
import ProjectDetails from "./components/ProjectDetails";
import ContactUs from "./components/ContactUs";
import BlogDetail from "./components/BlogDetail";
import AllBlogs from "./pages/AllBlogs";
import { ScrollToTop } from "./components/scrollToTop";
import { PageTransition } from "./components/PageTransition";

// Administrative Executive Portal
import { AdminAuthProvider, ProtectedAdminRoute } from "./admin/AdminAuthContext";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/pages/AdminLogin";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminInterior } from "./admin/pages/AdminInterior";
import { AdminModels } from "./admin/pages/AdminModels";
import { AdminTours } from "./admin/pages/AdminTours";
import { AdminBlog } from "./admin/pages/AdminBlog";
import { AdminPages } from "./admin/pages/AdminPages";
import { AdminInquiries } from "./admin/pages/AdminInquiries";
import { AdminSettings } from "./admin/pages/AdminSettings";
import { ProjectBuilder } from "./admin/builder/ProjectBuilder";
import { BlogBuilder } from "./admin/builder/BlogBuilder";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Architectural Experience with Smooth Ease-In/Out Transitions */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/interior"
          element={
            <PageTransition>
              <Interior />
            </PageTransition>
          }
        />
        <Route
          path="/model-making"
          element={
            <PageTransition>
              <ModelMaking />
            </PageTransition>
          }
        />
        <Route
          path="/project-detail"
          element={
            <PageTransition>
              <ProjectDetails />
            </PageTransition>
          }
        />
        <Route
          path="/gallery"
          element={
            <PageTransition>
              <PanoramaGallery />
            </PageTransition>
          }
        />
        <Route
          path="/view360"
          element={
            <PageTransition>
              <PanoramaViewer />
            </PageTransition>
          }
        />
        <Route
          path="/view360/:id"
          element={
            <PageTransition>
              <PanoramaViewer />
            </PageTransition>
          }
        />
        <Route
          path="/contactus"
          element={
            <PageTransition>
              <ContactUs />
            </PageTransition>
          }
        />
        <Route
          path="/blog"
          element={
            <PageTransition>
              <AllBlogs />
            </PageTransition>
          }
        />
        <Route
          path="/blogs"
          element={
            <PageTransition>
              <AllBlogs />
            </PageTransition>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <PageTransition>
              <BlogDetail />
            </PageTransition>
          }
        />
        <Route
          path="/allblogs"
          element={
            <PageTransition>
              <AllBlogs />
            </PageTransition>
          }
        />

        {/* Studio Administration & Content Management Portal */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="interior" element={<AdminInterior />} />
          <Route path="models" element={<AdminModels />} />
          <Route path="tours" element={<AdminTours />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Visual Editorial Project Builder / Composition Workspace */}
        <Route
          path="/admin/builder"
          element={
            <ProtectedAdminRoute>
              <ProjectBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/blog-builder"
          element={
            <ProtectedAdminRoute>
              <BlogBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/blog-builder/:id"
          element={
            <ProtectedAdminRoute>
              <BlogBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/blog/builder"
          element={
            <ProtectedAdminRoute>
              <BlogBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/blog-builder"
          element={
            <ProtectedAdminRoute>
              <BlogBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/builder/:type"
          element={
            <ProtectedAdminRoute>
              <ProjectBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/builder/:type/:id"
          element={
            <ProtectedAdminRoute>
              <ProjectBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedAdminRoute>
              <ProjectBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/builder/:type"
          element={
            <ProtectedAdminRoute>
              <ProjectBuilder />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/builder/:type/:id"
          element={
            <ProtectedAdminRoute>
              <ProjectBuilder />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useSmoothScroll();

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div id="main" className="min-h-screen bg-black text-white">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
