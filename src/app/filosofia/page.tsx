import { FaBookOpen, FaLightbulb, FaEye } from "react-icons/fa";
import "./FilosofiaPage.css";
import { PageHeader } from "@/components";

const FilosofiaPage = () => {
  return (
    <>
      <PageHeader>Filosofía</PageHeader>
      <div className="filosofia-container">

        <div className="intro-section">
          <div className="intro-content">
            <FaBookOpen className="intro-icon" />
            <p>
              La Biblioteca Kaxáant de la Universidad Politécnica de Quintana Roo (UPQROO) se concibe como un pilar fundamental en el apoyo a los procesos de enseñanza, aprendizaje e investigación de la comunidad universitaria. Su filosofía se encuentra sólidamente cimentada en una clara misión, visión y valores que orientan su quehacer diario.
            </p>
          </div>
        </div>

        <div className="card-container">
          <div className="filosofia-card">
            <div className="card-icon">
              <FaLightbulb />
            </div>
            <h2>Misión</h2>
            <div className="card-divider"></div>
            <p>
              Apoyar los procesos de enseñanza, aprendizaje e investigación de la comunidad universitaria, facilitando el acceso a recursos de información especializados que fortalezcan el desarrollo académico y la innovación.
            </p>
          </div>

          <div className="filosofia-card">
            <div className="card-icon">
              <FaEye />
            </div>
            <h2>Visión</h2>
            <div className="card-divider"></div>
            <p>
              Ser reconocida como un centro de información de excelencia, que contribuya de manera efectiva al cumplimiento de los objetivos estratégicos de la Universidad Politécnica de Quintana Roo, a través de servicios y recursos de información de vanguardia.
            </p>
          </div>
        </div>

        <div className="valores-section">
          <h2>Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-item">
              <h3>Excelencia</h3>
              <p>Buscamos la máxima calidad en nuestros servicios y recursos</p>
            </div>
            <div className="valor-item">
              <h3>Innovación</h3>
              <p>Implementamos soluciones creativas para necesidades académicas</p>
            </div>
            <div className="valor-item">
              <h3>Accesibilidad</h3>
              <p>Garantizamos igualdad de oportunidades para todos los usuarios</p>
            </div>
            <div className="valor-item">
              <h3>Compromiso</h3>
              <p>Dedicación total al desarrollo académico de nuestra comunidad</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilosofiaPage