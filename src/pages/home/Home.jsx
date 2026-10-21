import Banner from './Banner';
import Services from './Services';
import LogoSlider from './LogoSlider';
import Benefits from './Benefits';
import MerchantBanner from './MerchantBanner';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import HowItWorks from './HowItWorks';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <Services></Services>
            <LogoSlider></LogoSlider>
            <Benefits></Benefits>
            <MerchantBanner></MerchantBanner>
            <Testimonials></Testimonials>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;