
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import AppointmentForm from "@/components/AppointmentForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div id="about">
          <About />
        </div>
        <Services />
        <div id="equipe">
          <Team />
        </div>
        <Testimonials />
        <AppointmentForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
