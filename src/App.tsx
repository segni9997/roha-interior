import { BrowserRouter, Route, Routes } from "react-router-dom"

import Interior from "./pages/interior"
import ModelMaking from "./pages/modelMaking"
import Home from "./pages/Home"
// import ProjectDetail from "./components/Projectdetail";
import PanoramaGallery from "./components/Panaroma-gallery";
import PanoramaViewer from "./components/PanaromaViewer";
import { useSmoothScroll } from "./hook/useSmoothScroll";
import ProjectDetails from "./components/ProjectDetails";
import ContactUs from "./components/ContactUs";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./components/BlogDetail";
import AllBlogs from "./pages/AllBlogs";


function App() {
useSmoothScroll()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interior" element={<Interior />} />
          <Route path="/model-making" element={<ModelMaking />} />
          <Route
            path="/project-detail"
            element={
              <ProjectDetails  />
            }
          />
          
          <Route path="/gallery" element={<PanoramaGallery />} />
          <Route path="/view360" element={<PanoramaViewer/>}/>
          <Route path="/contactus" element= {<ContactUs/>}/>
          <Route path = "/blog" element={<BlogPage/>}/>
          <Route path = "/blog/:id" element ={<BlogDetail/>}/>
          <Route path = "/allblogs" element= {<AllBlogs/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
