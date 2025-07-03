import Link from "next/link";

export default function NavigationMenu({ path = [] }) {
  return (
    <nav className="bg-[#F4F6F9]  max-w-[1240px] mx-auto  h-10 text-sm text-[#6C757D] flex items-center font-normal px-6 py-4">
      <div className="">
        {path.map((item, index) => (
          <span key={index}>
            {item.href ? (
              <Link href={item.href} className="hover:underline">{item.label}</Link>
            ) : (
              <span className="text-[#6C757D]">{item.label}</span>
            )}
            {index < path.length - 1 && <span className="mx-1 font-medium">{'>'}</span>}
          </span>
        ))}
      </div>
    </nav>
  );
}