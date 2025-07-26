import Hero from '../components/hero';
import About from '../components/About';
import ParallaxImage from '../components/Parallax';
import Category from '../components/Categories';
import ProjectGallery from '../components/Gallery';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <ParallaxImage />

      <Category />
      <ProjectGallery />
    </>
  );
}

export default Home
