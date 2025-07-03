import React from "react";
import { CiHeart } from "react-icons/ci";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";

const cards = [
  {
    icon: <CiHeart className="w-6 h-6 text-[#171412]" />,
    title: "Compassionate Guidance",
    description:
      "We offer compassionate guidance and support to help you navigate the challenges and joys of mindfulness practice.",
  },
  {
    icon: <VscWorkspaceTrusted className="w-6 h-6 text-[#171412]" />,
    title: "Trusted Resources",
    description:
      "Our resources are grounded in scientific research and best practices, ensuring you receive reliable and effective tools.",
  },
  {
    icon: <CgProfile  className="w-6 h-6 text-[#171412]" />,
    title: "Community Support",
    description:
      "Join our vibrant community of like-minded individuals to connect, share experiences, and support each other on the path to mindfulness.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 px-4 sm:px-6 md:px-10">
      <h2 className="text-[24px] sm:text-3xl md:text-4xl font-semibold text-[#151515] text-left">
        Why Choose Us?
      </h2>

      <p className="mt-4 text-[15px] sm:text-[17px] md:text-[18px] max-w-3xl text-left text-[#151515] leading-[24px] sm:leading-[26px] md:leading-[28.8px]">
        At Mindful Path, we understand your journey — the sleepless nights, the
        mountain of syllabus, and the hunger to serve the nation. Our platform
        is designed with real UPSC experiences, offering what truly works — not
        just textbook theory.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="w-full max-w-[301px] h-auto sm:h-[191px] border rounded-[8px] border-[#E3E0DB] p-5 bg-white shadow-sm flex flex-col items-start mx-auto"
          >
            {card.icon}
            <h3 className="font-bold text-[#151515] text-base sm:text-lg leading-5 mb-2 mt-3">
              {card.title}
            </h3>
            <p className="text-sm text-[#555555]">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 sm:mt-20">
        <h3 className="text-[22px] sm:text-3xl md:text-4xl leading-[32px] sm:leading-[40px] md:leading-[45px] font-semibold text-[#151515]">
          Ready to Begin Your Mindfulness <br className="hidden sm:block" />
          Journey?
        </h3>
        <button className="mt-6 bg-[#FF914D] hover:bg-orange-600 rounded-[24px] text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 transition">
          Get Started
        </button>
      </div>
    </section>
  );
}
