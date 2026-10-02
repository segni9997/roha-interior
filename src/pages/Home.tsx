import Hero from '../components/hero';
import Categories from '../components/category';
import Footer from '../components/Footer';
import BlogPage from './BlogPage';
import { NavigationOverlay } from '../components/NavBar';
import ClientsSection from '../components/ClientsSection';

const Home = () => {
  return (
    <>
      <NavigationOverlay />
      <Hero />
      <Categories />
      <BlogPage />
      <ClientsSection />
      <Footer />
    </>
  );
};

export default Home;

