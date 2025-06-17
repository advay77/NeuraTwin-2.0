import Link from "next/link";

type Suggestion = {
  title: string;
  icon: string;
  href?: string;
};

export const SuggestionsBar = ({
  suggestions,
}: {
  suggestions: Suggestion[];
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <div className="flex gap-4 flex-nowrap py-2 px-1">
        {suggestions.map((item, index) => {
          const Card = (
            <div className="min-w-[180px] bg-white/30 rounded-xl shadow-md px-4 py-2 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer">
              <div className="text-2xl">{item.icon}</div>
              <div className="font-medium text-white font-sora whitespace-nowrap tracking-tight">
                {item.title}
              </div>
            </div>
          );
          return item.href ? (
            <Link key={index} href={item.href}>
              {Card}
            </Link>
          ) : (
            <div key={index}>{Card}</div>
          );
        })}
      </div>
    </div>
  );
};
