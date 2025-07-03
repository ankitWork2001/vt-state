import NavigationMenu from "@/components/common/NavigationMenu";
import MissionSection from "@/components/About/MissionSection";
import WhyChooseUs from "@/components/About/WhyChooseUs";

const About = () => {
  return (
    <div className="bg-white w-full mx-auto">
      <NavigationMenu
        path={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <div className="max-w-[960px] w-full mx-auto px-4 sm:px-6">
        <MissionSection />
        <WhyChooseUs />
      </div>
    </div>
  );
};

export default About;
