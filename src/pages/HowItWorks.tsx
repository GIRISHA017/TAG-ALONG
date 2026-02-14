import Navbar from "@/components/Navbar";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <HowItWorksSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
