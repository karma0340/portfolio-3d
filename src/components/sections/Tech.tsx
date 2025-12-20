import { useEffect, useState } from "react";
import { technologies } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { BallCanvas } from "../canvas";

const Tech = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices (max-width: 768px for tablets and phones)
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology) => (
          <div className="h-28 w-28" key={technology.name}>
            {isMobile ? (
              // Mobile: Render 2D image with nice styling
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={technology.icon}
                  alt={technology.name}
                  className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
            ) : (
              // Desktop: Render 3D ball
              <BallCanvas icon={technology.icon} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
