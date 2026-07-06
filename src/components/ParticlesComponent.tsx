import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

type ParticlesProps = {
  id: string;
  className?: string; // <-- make className optional
};

const ParticlesComponent = ({ id, className }: ParticlesProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container: any) => {
    console.log(container);
  };

  const options = useMemo(() => ({
    background: {
      color: { value: "#ffff" },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "repulse" },
        onHover: { enable: true, mode: "grab" },
      },
      modes: {
        repulse: { distance: 200 },
        grab: { distance: 150 },
      },
    },
    particles: {
      color: { value: "#0000" },
      links: {
        color: "#0000",
        distance: 200,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        random: true,
        outModes: { default: "bounce" },
      },
      number: {
        density: { enable: true },
        value: 150,
      },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id={id}
      className={className} // <-- now you can use className safely
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
};

export default ParticlesComponent;