import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Amenities from "@/components/Amenities";
import GalleryPreview from "@/components/GalleryPreview";
import BookingSection from "@/components/BookingSection";
import FeedbackSection from "@/components/FeedbackSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Amenities />
        <GalleryPreview />
        <BookingSection />
        <FeedbackSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
