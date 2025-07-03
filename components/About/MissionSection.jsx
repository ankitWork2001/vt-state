
import Image from "next/image";

export default function MissionSection() {
  return (
    <section className="text-center py-8 px-4 sm:py-12 sm:px-6">
      <h2 className="text-[24px] sm:text-[32px] font-bold text-[#35590E]">Our Mission</h2>

      <p className="mt-4 max-w-[928px] mx-auto text-[15px] sm:text-[18px] text-[#151515] leading-[24px] sm:leading-[28.5px]">
        At Mindful Path, our mission is to empower individuals to cultivate inner peace,
        resilience, and fulfillment through the practice of mindfulness. We believe that
        by fostering self-awareness, compassion, and presence, we can unlock our full
        potential and live more meaningful lives.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <Image
          src="/imgs/founder.png"
          width={80}
          height={80}
          alt="Sarah Roy"
          unoptimized
          className="rounded-full sm:w-[96px] sm:h-[96px]"
        />

        <h3 className="mt-4 text-[18px] sm:text-[22px] font-bold">Sarah Roy</h3>
        <p className="text-gray-500 text-[14px] sm:text-[16px]">Founder of Mindful Path</p>
      </div>
    </section>
  );
}
