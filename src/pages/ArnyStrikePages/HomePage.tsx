import { useEffect, useState } from "react";
import "../../styles/ArnyStrikePages/HomePage.css";
import Group from "../../components/ArmyStrikeComponents/group";
import MujahGroup from "../../components/ArmyStrikeComponents/mujahidsGroup";
import { useNavigate } from "react-router-dom";
import { groupPositions } from "../../components/ArmyStrikeComponents/GroupPosition";
interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navigate = useNavigate();

  const handleGroupClick = (index: number) => {
    navigate(`/group/${index}`);
  };
  const handleStrategyPage = () => {
    navigate(`/strategyScreen`);
  };

  return (
    <>
      {/* Game Content */}
      <div className={` wrapper`}>
        <button
          className="btn btn-dark text-light rounded-pill px-3 py-2"
          onClick={handleStrategyPage}
          style={{ position: "fixed", right: "20px", top: "20px" }}
        >
          <i className="bi bi-card-list fs-1 "></i>
        </button>
        <div
          className="lens-overlay"
          style={{
            WebkitMaskImage: `radial-gradient(circle ${
              window.innerWidth < 768 ? 100 : 300
            }px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 60%)`,
            maskImage: `radial-gradient(circle ${
              window.innerWidth < 768 ? 100 : 300
            }px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 60%)`,
          }}
        ></div>

        <div
          className="lenz"
          style={{
            position: "fixed",
            top: mousePos.y - (window.innerWidth < 768 ? 100 : 300), // Adjust for lens size
            left: mousePos.x - (window.innerWidth < 768 ? 100 : 300),
            pointerEvents: "none", // So it doesn't block clicks
            zIndex: 9999,
          }}
        >
          <img src="/gun-lens.svg" width="100%" height="100%" alt="" />
        </div>

        {/* Add the mujah groups */}
        <div className="container-fluid">
          <div className="row">
            {groupPositions.map((group, index) => (
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4 d-flex justify-content-center align-items-end my-5">
                <div
                  key={index}
                  onClick={() => handleGroupClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  <MujahGroup
                    signPosition={group.signPosition}
                    soldierCount={group.soldierCount}
                    imgPath={group.imgPath}
                    isCage={group.isCage}
                    powerVariables={group.powerVariables}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="row">
            {[1, 2, 3, 4, 5, 6].map(() => (
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 col-xxl-3">
                <Group />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
