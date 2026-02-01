import Hero from '../components/hero';
// import About from '../components/About';
// import ParallaxImage from '../components/Parallax';
// import Category from '../components/Categories';
import Categories from '../components/category';
import Footer from '../components/Footer';
import BlogPage from './BlogPage';
import MargaNavbar from '../components/modelMakingNavBar';
import NavigationOverlay from '../components/NavBar';
// import ProjectDetails from '../components/ProjectDetails';
// import ParallaxGrid from '../components/ParallaxGrid';
// import ProjectGallery from '../components/Gallery';

const Home = () => {
  return (
    <>
    {/* <MargaNavbar/> */}
    <NavigationOverlay/>
      <Hero />
 
    <Categories/>
    <BlogPage/>
        <Footer/> 
      {/* <Category /> */}
           {/* <About /> */}
      {/* <ParallaxImage /> */}
      {/* <ProjectGallery /> */}
    </>
  );
}

export default Home
