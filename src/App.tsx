import { BrowserRouter } from "react-router-dom";

import { Suspense, lazy, useEffect } from "react";

import { config } from "./constants/config";

// Lazy load heavy/section components
const About = lazy(() => import("./components/sections/About"));
const Contact = lazy(() => import("./components/sections/Contact"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Feedbacks = lazy(() => import("./components/sections/Feedbacks"));
const Hero = lazy(() => import("./components/sections/Hero"));
const Navbar = lazy(() => import("./components/layout/Navbar"));
const Tech = lazy(() => import("./components/sections/Tech"));
const Works = lazy(() => import("./components/sections/Works"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="bg-primary relative z-0">
        <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <Hero />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Feedbacks />
        </Suspense>
        <div className="relative z-0">
          <Suspense fallback={<div>Loading...</div>}>
            <Contact />
            <StarsCanvas />
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
