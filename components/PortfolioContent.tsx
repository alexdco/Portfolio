import {AboutSection} from "@/components/sections/AboutSection";
import {AchievementsSection} from "@/components/sections/AchievementsSection";
import {BlogSection} from "@/components/sections/BlogSection";
import {CertificationsSection} from "@/components/sections/CertificationsSection";
import {EducationSection} from "@/components/sections/EducationSection";
import {ExperienceSection} from "@/components/sections/ExperienceSection";
import Hero from "@/components/sections/Hero";
import {ProjectsSection} from "@/components/sections/ProjectsSection";
import {SkillsSection} from "@/components/sections/SkillsSection";
import {ContactSection} from "@/components/sections/ContactSection";

const PortfolioContent = async () => {
    return (
        <>
            <Hero />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection />
            <CertificationsSection />
            <BlogSection />
            <ContactSection />



        </>
    );
};

export default PortfolioContent;