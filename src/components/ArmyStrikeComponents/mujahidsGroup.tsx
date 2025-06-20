import React from "react";

interface MujahGroupProps {
  signPosition: number;
  soldierCount: number;
  imgPath?: string; // actual image path
  isCage?: boolean; // flag to determine if it should render Cage
  powerVariables?: Array<{ char: string; power: number }>; // for Cage component
}

const MujahGroup: React.FC<MujahGroupProps> = ({
  signPosition,
  soldierCount,
  imgPath,
  isCage = false,
  powerVariables = [{ char: "x", power: 6 }],
}) => {
  const totalPower = powerVariables.reduce((sum, v) => sum + v.power, 0);

  const Cage = () => {
    return (
      <>
        {powerVariables.map((variable, index) => (
          <div key={index} className="cage-content">
            {Array(variable.power)
              .fill(0)
              .map((_, i) => (
                <img
                  key={i}
                  src="/signs/cage-army-red.svg"
                  alt="myarmy"
                  className="cagearmy"
                  style={{
                    maxWidth: window.innerWidth < 768 ? 20 : 40,
                    maxHeight: window.innerWidth < 768 ? 20 : 40,
                  }}
                />
              ))}
          </div>
        ))}
      </>
    );
  };
  return (
    <div
      className="mujah-group"
      style={{
        position: "relative",
      }}
    >
      {Array.from({ length: soldierCount }).map((_, index) => (
        <React.Fragment key={index}>
          <img
            src="/myarmy-left-side.svg"
            alt="soldier"
            className="mujah-soldier"
          />
          {index === signPosition - 1 &&
            (isCage ? (
              <div
                className="cage"
                style={{
                  width:
                    totalPower > 2
                      ? `${
                          (window.innerWidth < 768 ? 30 : 60) * soldierCount
                        }px`
                      : "100px",
                }}
              >
                <img
                  src="/signs/power.svg"
                  alt="power"
                  className="electricshocksign"
                />
                <img src="/signs/value2.png" alt="cage" className="cageBody" />
                <div
                  className="cage-army-cover"
                  // style={{
                  //   width: `${soldierCount * 40}px`,
                  //   height: `${soldierCount * 50 / 2}px`,
                  // }}
                >
                  <Cage />
                </div>
              </div>
            ) : (
              <img
                src={imgPath || "/signs/addition.svg"} // default to addition if no path
                alt="army-sign"
                className="mujah-sign"
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MujahGroup;
