import "../../styles/DeepSeaAdventurePages/HomePage.css";
import { useState, useEffect } from "react";
import useSound from "use-sound";

type ImageAsset = {
  id: number;
  value: number | null;
  src: string;
  alt: string;
  width?: number;
};

interface LayoutConfig {
  imageWidth: number;
  imageHeight: number;
  gapSize: number;
  paddingAround: number;
}

interface QuestionItem {
  equation: string;
  x: number;
  y: number;
  constant: number;
}

const questions: QuestionItem[] = [
  {
    equation: "5y + 15 = ''",
    x: 0,
    y: 5,
    constant: 15,
  },
  {
    equation: "9y + 15 = ''",
    x: 0,
    y: 9,
    constant: 15,
  },
  {
    equation: "10y + 15 = ''",
    x: 0,
    y: 10,
    constant: 15,
  },
  {
    equation: "7y + 15 = ''",
    x: 0,
    y: 7,
    constant: 15,
  },
  {
    equation: "5y + 15 = ''",
    x: 0,
    y: 5,
    constant: 15,
  },
  {
    equation: "5x + 15 = ''",
    x: 8,
    y: 0,
    constant: 15,
  },
];

const HomePage: React.FC = () => {
  const [playHoverSound] = useSound("/bubble-pop-6-351337.mp3");
  const [click] = useSound("/computer-mouse-click-351398.mp3");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
  const [completedValues, setCompletedValues] = useState<{
    x: number;
    y: number;
    constant: number;
  }>({
    x: 0,
    y: 0,
    constant: 0,
  });

  // Timer states
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [isEquationCorrect, setIsEquationCorrect] = useState(false);

  const [dolphinClicks, setDolphinClicks] = useState(0);
  const [turtleClicks, setTurtleClicks] = useState(0);
  const [clickedImages, setClickedImages] = useState<Record<number, boolean>>(
    {}
  );
  const [clickedEggs, setClickedEggs] = useState<Record<number, boolean>>({});

  // History states
  const [clickHistory, setClickHistory] = useState<
    Array<{
      type: "image" | "egg";
      index: number;
      image?: ImageAsset;
      value?: number;
    }>
  >([]);

  const originalImages: ImageAsset[] = [
    { src: "/dolphanLightBlue.svg", alt: "Asset 5", id: 2, value: 1 },
    { src: "/starfish.svg", alt: "Asset 6", id: 3, value: null },
    { src: "/turtle-right.svg", alt: "Asset 3", id: 4, value: 1 },
  ];

  const config: LayoutConfig = {
    imageWidth: window.innerWidth <= 767 ? 30 : 60,
    imageHeight: window.innerWidth <= 767 ? 30 : 60,
    gapSize: 10,
    paddingAround: 20,
  };

  const [shuffledImages, setShuffledImages] = useState<ImageAsset[]>([]);
  const [gridConfig, setGridConfig] = useState({
    cols: 0,
    rows: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // Timer countdown effect
  useEffect(() => {
    let interval: number;

    if (isTimerRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Compare values when time runs out
      const currentQuestion = questions[selectedQuestionIndex];
      const isCorrect =
        turtleClicks === currentQuestion.x &&
        dolphinClicks === currentQuestion.y &&
        completedValues.constant === currentQuestion.constant;
      setIsEquationCorrect(isCorrect);
      setShowTimeUpPopup(true);
    }

    return () => window.clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const candyShuffle = (
    images: ImageAsset[],
    rows: number,
    cols: number
  ): ImageAsset[][] => {
    const flatArray: ImageAsset[] = [];
    const totalCells = rows * cols;

    for (let i = 0; i < totalCells; i++) {
      const randomIndex = Math.floor(Math.random() * images.length);
      flatArray.push({ ...images[randomIndex] });
    }

    const newGrid: ImageAsset[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: ImageAsset[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(flatArray[r * cols + c]);
      }
      newGrid.push(row);
    }

    return newGrid;
  };

  const calculateGrid = () => {
    const availableWidth =
      window.innerWidth -
      2 * config.paddingAround -
      (window.innerWidth < 767 ? 0 : 180);
    const availableHeight = window.innerHeight * 0.8 - 2 * config.paddingAround;

    const cols = Math.max(
      3,
      Math.floor(availableWidth / (config.imageWidth + config.gapSize))
    );
    const rows = Math.max(
      3,
      Math.floor(availableHeight / (config.imageHeight + config.gapSize))
    );

    const gridWidth =
      cols * (config.imageWidth + config.gapSize) - config.gapSize;
    const offsetX =
      (window.innerWidth - gridWidth - (window.innerWidth < 767 ? 0 : 180)) / 2;

    const offsetY = config.paddingAround;

    setGridConfig({
      cols,
      rows,
      offsetX,
      offsetY,
    });

    const newGrid = candyShuffle(originalImages, rows, cols);
    setShuffledImages(newGrid.flat());
  };

  useEffect(() => {
    calculateGrid();
    setSelectedQuestionIndex(0);
    setIsTimerRunning(true);
    const handleResize = () => {
      calculateGrid();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageClick = (index: number, image: ImageAsset) => {
    if (clickedImages[index] || image.src.includes("starfish.svg")) {
      return;
    }

    click();
    setClickedImages((prev) => ({ ...prev, [index]: true }));
    setClickHistory((prev) => [...prev, { type: "image", index, image }]);

    if (image.src.includes("dolphanLightBlue.svg")) {
      setDolphinClicks((prev) => prev + 1);
      const newCount = (clickCounts[image.id] || 0) + 1;
      setClickCounts({ ...clickCounts, [image.id]: newCount });
      setCompletedValues((prev) => ({
        ...prev,
        x: newCount,
      }));
    } else if (image.src.includes("turtle-right.svg")) {
      setTurtleClicks((prev) => prev + 1);
      const newCount = (clickCounts[image.id] || 0) + 1;
      setClickCounts({ ...clickCounts, [image.id]: newCount });
      setCompletedValues((prev) => ({
        ...prev,
        y: newCount,
      }));
    }
  };

  const handleEggpearlClick = (index: number, value: number) => {
    if (clickedEggs[index]) {
      return;
    }

    click();
    setClickedEggs((prev) => ({ ...prev, [index]: true }));
    setClickHistory((prev) => [...prev, { type: "egg", index, value }]);

    setCompletedValues((prev) => ({
      ...prev,
      constant: prev.constant + value,
    }));
  };

  const undoLastClick = () => {
    if (clickHistory.length === 0) return;

    click();

    const lastAction = clickHistory[clickHistory.length - 1];

    if (lastAction.type === "image" && lastAction.image) {
      // Undo image click
      setClickedImages((prev) => {
        const newState = { ...prev };
        delete newState[lastAction.index];
        return newState;
      });

      if (lastAction.image.src.includes("dolphanLightBlue.svg")) {
        setDolphinClicks((prev) => prev - 1);
        const newCount = (clickCounts[lastAction.image.id] || 0) - 1;
        setClickCounts({ ...clickCounts, [lastAction.image.id]: newCount });
        setCompletedValues((prev) => ({
          ...prev,
          x: newCount,
        }));
      } else if (lastAction.image.src.includes("turtle-right.svg")) {
        setTurtleClicks((prev) => prev - 1);
        const newCount = (clickCounts[lastAction.image.id] || 0) - 1;
        setClickCounts({ ...clickCounts, [lastAction.image.id]: newCount });
        setCompletedValues((prev) => ({
          ...prev,
          y: newCount,
        }));
      }
    } else if (lastAction.type === "egg" && lastAction.value !== undefined) {
      // Undo egg click
      setClickedEggs((prev) => {
        const newState = { ...prev };
        delete newState[lastAction.index];
        return newState;
      });

      setCompletedValues((prev) => ({
        ...prev,
        constant: prev.constant - lastAction.value!,
      }));
    }

    setClickHistory((prev) => prev.slice(0, -1));
  };

  const restartGame = () => {
    setTimeLeft(60);
    setIsTimerRunning(true);
    setShowTimeUpPopup(false);
    setClickedImages({});
    setClickedEggs({});
    setClickHistory([]);
    setDolphinClicks(0);
    setTurtleClicks(0);
    setCompletedValues({ x: 0, y: 0, constant: 0 });
    setSelectedQuestionIndex(0);
    calculateGrid();
  };

  if (shuffledImages.length === 0) {
    return <div className="wrapper">Loading...</div>;
  }

  const currentQuestion = questions[selectedQuestionIndex];

  return (
    <div className="deep-ocean-cover">
      <div className="deep-ocean-wrapper">
        <div className="sidebar">
          <div className="sidebar-content">
            <div className="equation-display">
              <div className="fs-6 fw-bold Target text-center">TARGET </div>
              <div className="d-flex gap-2 text-light">
                <div className="target-x">
                  <span className="">
                    <img
                      src="/turtle-right.svg"
                      alt="constant"
                      width={20}
                      height={30}
                    />
                  </span>
                  <span className="target-x-color">{currentQuestion.x}</span>
                </div>
                <div className="target-y">
                  <span className="">
                    <img
                      src="/dolphanLightBlue.svg"
                      alt="constant"
                      width={20}
                      height={30}
                    />
                  </span>
                  <span className="target-y-color">{currentQuestion.y}</span>
                </div>
                <div className="target-constant">
                  <span className="">
                    <img
                      src="/constant.svg"
                      alt="constant"
                      width={20}
                      height={30}
                    />
                  </span>
                  <span className="target-constant-color">
                    {currentQuestion.constant}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="fs-6 fw-bold Current text-center">CURRENT </div>
            <div className="d-flex align-items-center gap-2 text-light">
              <div className="target-x">
                <span className="">
                  <img src="/turtle-right.svg" alt="constant" />
                </span>
                <span className="target-x-color">{turtleClicks}</span>
              </div>
              <div className="target-y">
                <span className="">
                  <img src="/dolphanLightBlue.svg" alt="constant" />
                </span>
                <span className="target-y-color">{dolphinClicks}</span>
              </div>
              <div className="target-constant">
                <span className="">
                  <img src="/constant.svg" alt="constant" />
                </span>
                <span className="target-constant-color">
                  {completedValues.constant}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <div className="undo cursor" onClick={undoLastClick}>
              <i className="bi bi-arrow-clockwise text-light "></i>
            </div>
            <div className="timer">
              <div className="d-flex align-items-center">
                <div className="">
                  <img
                    src="/vecteezy_vintage-blue-alarm-clock-with-yellow-accents-on_55662929.png"
                    alt=""
                    width="40px"
                  />
                </div>
                <div
                  className="progress"
                  style={{ height: 10, width: "120px", marginLeft: "-5px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${(timeLeft / 60) * 100}%`,
                      backgroundColor: "#326487",
                      transition: "width 1s linear",
                    }}
                    aria-valuenow={timeLeft}
                    aria-valuemin={0}
                    aria-valuemax={60}
                  />
                </div>
              </div>
              <div className="text-light time">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </div>
        <div className="find-area">
          <div
            className="grid-container"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(${config.imageWidth}px, 1fr))`,
              gridAutoRows: `minmax(${config.imageHeight}px, 1fr)`,
            }}
          >
            {shuffledImages.map((image, index) => {
              const row = Math.floor(index / gridConfig.cols);
              const col = index % gridConfig.cols;

              return (
                <div
                  className="grid-item"
                  key={`${row}-${col}-${image.src}`}
                  onMouseEnter={() => {
                    if (
                      !image.src.includes("starfish.svg") &&
                      !clickedImages[index]
                    ) {
                      playHoverSound();
                    }
                  }}
                  onClick={() => handleImageClick(index, image)}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`grid-image ${
                      clickedImages[index] ? "clicked" : ""
                    }`}
                    style={{
                      cursor:
                        image.src.includes("starfish.svg") ||
                        clickedImages[index]
                          ? "default"
                          : "pointer",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pearl-wrapper">
        {questions.map((_, index) => (
          <div
            className={`egg-pearl ${
              index === selectedQuestionIndex ? "selected" : ""
            } ${clickedEggs[index] ? "clicked" : ""}`}
            style={{
              marginTop: index % 2 === 0 ? "-30px" : "0px",
            }}
            key={index}
            onMouseEnter={() => {
              if (!clickedEggs[index]) {
                playHoverSound();
              }
            }}
            onClick={() => handleEggpearlClick(index, index + 1)}
          >
            <img src="/egg_cover.svg" alt="" className="egg_cover" />
            <img src="/egg.svg" alt="" className="egg" />
            <div className="eggnumber" style={{ color: " rgb(25, 3, 46)" }}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Time's Up Popup */}
      {showTimeUpPopup && (
        <div className="time-up-popup">
          <div className="popup-content">
            <h3>Time's Up!</h3>
            <p>
              {isEquationCorrect
                ? "Congratulations! Your equation is correct!"
                : "Your equation is not correct. Try again!"}
            </p>
            <div className="result-comparison">
              <div className="target-values">
                <h4>Target Values:</h4>
                <p>Turtle (x): {currentQuestion.x}</p>
                <p>Dolphin (y): {currentQuestion.y}</p>
                <p>Constant: {currentQuestion.constant}</p>
              </div>
              <div className="current-values">
                <h4>Your Values:</h4>
                <p>Turtle (x): {turtleClicks}</p>
                <p>Dolphin (y): {dolphinClicks}</p>
                <p>Constant: {completedValues.constant}</p>
              </div>
            </div>
            <div className="popup-buttons">
              <button onClick={restartGame}>Play Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
