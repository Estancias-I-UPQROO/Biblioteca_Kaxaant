"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./RecursosElectronicosGrid.css"; // tu CSS original

type Props = {
  title: string;
  description: string;
  image: string;
  siteLink: string;
  index: number;
  expandedCardIndex: number | null;
  setExpandedCardIndex: (index: number | null) => void;
};

export const RecursosElectronicosCard = ({
  title,
  description,
  image,
  siteLink,
  index,
  expandedCardIndex,
  setExpandedCardIndex,
}: Props) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  console.log(title);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const isExpanded = expandedCardIndex === index;

  useEffect(() => {
    if (isTouchDevice && isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTouchDevice, isExpanded]);

  const handleTouchExpand = () => {
    if (isTouchDevice) {
      setExpandedCardIndex(isExpanded ? null : index);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setExpandedCardIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setExpandedCardIndex(null);
    }
  };

  const imageClasses = `w-full h-full object-cover rounded-xl ${
    isExpanded ? "blur-sm brightness-75" : "brightness-90"
  }`;

  const baseCard = (
    <div
      className="recursos-card group"
      onClick={isTouchDevice ? handleTouchExpand : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="recursos-card-image-container">
        <img src={image} alt={title} className={imageClasses} loading="lazy" />
        <div className="recursos-card-title-overlay">
          <h2 className="recursos-card-title">{title}</h2>
        </div>
        {!isTouchDevice && isExpanded && (
          <Link className="recursos-card-description-overlay" href={siteLink}>
            <p className="recursos-card-description">{description}</p>
          </Link>
        )}
      </div>
    </div>
  );

  const modal = isTouchDevice && isExpanded && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => setExpandedCardIndex(null)}
    >
      <div
        className="bg-white rounded-2xl aspect-square w-full max-w-sm relative overflow-hidden recursos-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="recursos-card-image-container">
          <img src={image} alt={title} className={imageClasses} />
          <div className="recursos-card-title-overlay">
            <h2 className="recursos-card-title">{title}</h2>
          </div>
          <div className="recursos-card-description-overlay">
            <p className="recursos-card-description">{description}</p>
            <Link
              href={siteLink}
              className="recursos-card-sitelink"
              onClick={(e) => e.stopPropagation()}
            >
              Visitar Sitio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {baseCard}
      {modal}
    </>
  );
};
