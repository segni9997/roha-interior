import { BrowserRouter, Route, Routes } from "react-router-dom"

import Interior from "./pages/interior"
import ModelMaking from "./pages/modelMaking"
import Home from "./pages/Home"
import ProjectDetail from "./components/Projectdetail";
import PanoramaGallery from "./components/Panaroma-gallery";
import PanoramaViewer from "./components/PanaromaViewer";


function App() {

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
              <ProjectDetail  />
            }
          />
          <Route path="/gallery" element={<PanoramaGallery />} />
          <Route path="/view360" element={<PanoramaViewer/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
