const TitleHeader = ({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-5 mb-3 md:mb-0">
      <div className="hero-badge py-1 md:py-2">
        <p className="text-xs md:text-base">{sub}</p>
      </div>
      <div>
        <h1 className="font-semibold md:text-5xl text-xl text-center px-2">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default TitleHeader;
