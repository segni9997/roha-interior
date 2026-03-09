import ModelHero from '../components/modelmakingHero'
// import MargaNavbar from '../components/modelMakingNavBar'
// import Navbar from '../components/modelMakingNavBar'
import SubCategoryModelGrid from '../components/modelMakingProjects'
import { NavigationOverlay } from '../components/NavBar'

// import FramerGlassyGrid from '../components/modelMakingProjects'
// import ModelProjects from '../components/modelMakingProjects'

const ModelMaking = () => {
  return (
    <>
          {/* <MargaNavbar /> */}
          <NavigationOverlay/>
          <ModelHero/>
          <SubCategoryModelGrid/>
       
    </>
  )
}

export default ModelMaking
