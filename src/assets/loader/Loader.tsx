import React, { useEffect, useState } from "react";
import "./Loader.css";

import CASHEW from "../../../data/cashew.png";
import ALMOND from "../../../data/almond.png";
import PISTACHIO from "../../../data/pistachio.png";

interface Nut {
  id: string;
  src: string;
  label: string;
  delay: string;
}

const nuts: Nut[] = [
  { id: "cashew", src: CASHEW, label: "cashew", delay: "0s" },
  { id: "almond", src: ALMOND, label: "almond", delay: "0.22s" },
  { id: "pistachio", src: PISTACHIO, label: "pistachio", delay: "0.44s" },
];

interface NutLoaderProps {
  text?: string;
}

const NutLoader: React.FC<NutLoaderProps> = ({
  text = "Gathering your harvest...",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="nut-loader-overlay" role="status" aria-label="Loading">
      <div className="nut-loader-content">
        <div className="nut-loader-row">
          {nuts.map(({ id, src, label, delay }) => (
            <div key={id} className="nut-char">
              <div className="nut-body" style={{ animationDelay: delay }}>
                <img src={src} alt={label} />
              </div>
              <div className="nut-shadow" style={{ animationDelay: delay }} />
            </div>
          ))}
        </div>
        <p className="nut-loader-text">{text}</p>
      </div>
    </div>
  );
};

export default NutLoader;
