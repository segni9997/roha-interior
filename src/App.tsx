import { BrowserRouter, Route, Routes } from "react-router-dom"

import Interior from "./pages/interior"
import ModelMaking from "./pages/modelMaking"
import Home from "./pages/Home"


function App() {

  return (
    <>
     
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/interior" element={<Interior />} />
          <Route path="/model-making" element={<ModelMaking />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
