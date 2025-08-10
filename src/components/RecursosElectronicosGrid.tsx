import React from "react";
import "./RecursosElectronicosGrid.css"; // tu CSS original

export const RecursosElectronicosGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="recursos-grid-container">
      <div className="recursos-grid">
        {children}
      </div>
    </section>
  );
};
