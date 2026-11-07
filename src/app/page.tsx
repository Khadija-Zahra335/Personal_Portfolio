import BackgroundEffects from "@/components/BackgroundEffects";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillMarquee from "@/components/SkillMarquee";
import Projects from "@/components/Projects";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PaletteSwitcher from "@/components/PaletteSwitcher";
import ContentProvider from "@/components/ContentProvider";
import { fetchContent } from "@/lib/content";

export const revalidate = 60;

function Divider() {
  return <div className="-mt-px h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />;
}

export default async function Home() {
  const content = await fetchContent();

  return (
    <ContentProvider initial={content}>
      <div className="relative min-h-dvh w-full bg-bgc pt-6 text-sm text-text transition-colors duration-150 md:text-base">
        <BackgroundEffects />
        <Navbar />

        <main className="relative z-[1]">
          <Hero />
          
          <SkillMarquee />
          <Divider />
          <About />
          <Divider />
          <Projects />
          
          
          <Divider />
          <TechStack />
          <Divider />
          <Education />
          <Divider />
          <Contact />
        </main>

        <Footer />
        <PaletteSwitcher />
      </div>
    </ContentProvider>
  );
}