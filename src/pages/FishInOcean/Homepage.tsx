import { useState, useEffect, useRef } from "react";
import Bubbles from "./Bubbles";
import "./Homepage.css";

function Homepage() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [calculationValue, setCalculationValue] = useState(1);
  const [darkCalculationValue, setDarkCalculationValue] = useState(3);
  const pearlAnimationRef = useRef<number | null>(null);
  const battleAnimationRef = useRef<number | null>(null);
  const fishRef = useRef<HTMLDivElement>(null);
  const darkFishRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerY, setCenterY] = useState(0);
  const [fishPosition, setFishPosition] = useState({ x: 5, y: 50 });
  const [darkFishPosition, setDarkFishPosition] = useState({
    x: 95,
    y: 50,
    visible: false,
  });
  const [gamePhase, setGamePhase] = useState("FishInOcean-collecting-pearls");
  const pearlPositionsRef = useRef<any[]>([]);
  const touchedPairsRef = useRef<Set<number>>(new Set());
  const [showKillAnimation, setShowKillAnimation] = useState(false);
  const [killAnimationPosition, setKillAnimationPosition] = useState({
    x: 0,
    y: 0,
  });
  const [gameOver, setGameOver] = useState({
    show: false,
    message: "",
    isWin: false,
  });
  const [battlePaused, setBattlePaused] = useState(false);

  // Pearl pairs data
  const pearlPairs = [
    [
      { value: "+1", brightness: 1 },
      { value: "-2", brightness: 1 },
    ],
    [
      { value: "+3", brightness: 1 },
      { value: "/1", brightness: 1 },
    ],
    [
      { value: "+5", brightness: 1 },
      { value: "-4", brightness: 1 },
    ],
    [
      { value: "+3", brightness: 1 },
      { value: "/1", brightness: 1 },
    ],
    [
      { value: "+5", brightness: 1 },
      { value: "-4", brightness: 1 },
    ],
    [
      { value: "+3", brightness: 1 },
      { value: "/1", brightness: 1 },
    ],
    [
      { value: "+5", brightness: 1 },
      { value: "-4", brightness: 1 },
    ],
    [
      { value: "+3", brightness: 1 },
      { value: "/1", brightness: 1 },
    ],
    [
      { value: "+5", brightness: 1 },
      { value: "-4", brightness: 1 },
    ],
  ];

  // Initialize pearl positions
  useEffect(() => {
    pearlPositionsRef.current = pearlPairs.flatMap((pair, pairIndex) => {
      return pair.map((pearl, pearlInPairIndex) => ({
        ...pearl,
        pairId: pairIndex,
        left: 500 + pairIndex * 700, // Changed from 200 to 700 for minimum distance
        top: pearlInPairIndex * 280 - 120, // -60 to center the pair vertically
        brightness: 1,
        touched: false,
      }));
    });
    touchedPairsRef.current = new Set();
  }, []);

  // Calculate center Y position
  useEffect(() => {
    if (containerRef.current) {
      setCenterY(containerRef.current.clientHeight / 2);
    }
  }, []);

  // Handle click to move fish
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || gamePhase !== "FishInOcean-collecting-pearls")
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;

    const newX = (clickX / containerRect.width) * 100;
    const newY = (clickY / containerRect.height) * 100;

    setFishPosition({
      x: Math.max(0, Math.min(newX, 100)),
      y: Math.max(0, Math.min(newY, 100)),
    });
  };

  // Check if all pearls have passed the left side
  const checkPearlsPassed = () => {
    return pearlPositionsRef.current.every((pearl) => pearl.left < -100);
  };

  // Show kill animation at fish position
  const showKillEffect = (fishRef: React.RefObject<HTMLDivElement | null>) => {
    if (!fishRef.current || !containerRef.current) return;
    debugger;
    const rect = fishRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const x =
      ((rect.left + rect.width / 2 - containerRect.left) /
        containerRect.width) *
      100;
    const y =
      ((rect.top + rect.height / 2 - containerRect.top) /
        containerRect.height) *
      100;

    setKillAnimationPosition({ x, y });
    setShowKillAnimation(true);
    setTimeout(() => {
      setShowKillAnimation(false);
    }, 1000);
  };

  // Reset the game state
  const resetGame = () => {
    setGameOver({ show: false, message: "", isWin: false });
    setTimeLeft(60);
    setCalculationValue(1);
    setDarkCalculationValue(10);
    setFishPosition({ x: 5, y: 50 });
    setDarkFishPosition({ x: 95, y: 50, visible: false });
    setGamePhase("FishInOcean-collecting-pearls");
    setBattlePaused(false);

    // Reset pearls
    pearlPositionsRef.current = pearlPairs.flatMap((pair, pairIndex) => {
      return pair.map((pearl, pearlInPairIndex) => ({
        ...pearl,
        pairId: pairIndex,
        left: 100 + pairIndex * 700,
        top: pearlInPairIndex * 220 - 60,
        brightness: 1,
        touched: false,
      }));
    });
    touchedPairsRef.current = new Set();
  };

  // Check fish collision when they get close
  const checkFishCollision = () => {
    if (!fishRef.current || !darkFishRef.current || battlePaused) return;

    const fishRect = fishRef.current.getBoundingClientRect();
    const darkFishRect = darkFishRef.current.getBoundingClientRect();

    if (
      fishRect.right > darkFishRect.left &&
      fishRect.left < darkFishRect.right &&
      fishRect.bottom > darkFishRect.top &&
      fishRect.top < darkFishRect.bottom
    ) {
      // Pause the battle
      setBattlePaused(true);

      if (calculationValue > darkCalculationValue) {
        showKillEffect(darkFishRef);
        setDarkFishPosition((prev) => ({ ...prev, visible: false })); // Hide immediately

        // Show win message after 3 seconds
        setTimeout(() => {
          setGameOver({
            show: true,
            message: "You Win!",
            isWin: true,
          });
        }, 3000);
      } else if (darkCalculationValue > calculationValue) {
        showKillEffect(fishRef);
        setFishPosition((prev) => ({ x: -100, y: prev.y })); // Move immediately off screen

        // Show lose message after 3 seconds
        setTimeout(() => {
          setGameOver({
            show: true,
            message: "You Lose!",
            isWin: false,
          });
        }, 3000);
      } else {
        showKillEffect(fishRef);
        showKillEffect(darkFishRef);
        setFishPosition((prev) => ({ x: -100, y: prev.y })); // Move immediately off screen
        setDarkFishPosition((prev) => ({ ...prev, visible: false })); // Hide immediately

        // Show tie message after 3 seconds
        setTimeout(() => {
          setGameOver({
            show: true,
            message: "It's a Tie!",
            isWin: false,
          });
        }, 3000);
      }
    }
  };

  // Collision detection for pearls
  useEffect(() => {
    const checkCollision = () => {
      if (!fishRef.current || gamePhase !== "FishInOcean-collecting-pearls")
        return;

      const fishRect = fishRef.current.getBoundingClientRect();

      pearlPositionsRef.current = pearlPositionsRef.current.map((pos) => {
        if (touchedPairsRef.current.has(pos.pairId)) {
          return {
            ...pos,
            brightness: pos.touched ? 0.3 : pos.brightness,
          };
        }

        const pearlRect = {
          left: pos.left,
          right: pos.left + 100,
          top: centerY + pos.top,
          bottom: centerY + pos.top + 100,
        };

        if (
          pearlRect.right > fishRect.left &&
          pearlRect.left < fishRect.right &&
          pearlRect.bottom > fishRect.top &&
          pearlRect.top < fishRect.bottom &&
          pos.brightness === 1
        ) {
          touchedPairsRef.current.add(pos.pairId);

          const pearlValue = pos.value;
          let operator = "";
          let number = 0;

          if (["+", "-", "*", "/"].includes(pearlValue.charAt(0))) {
            operator = pearlValue.charAt(0);
            number = parseFloat(pearlValue.substring(1));
          } else {
            number = parseFloat(pearlValue);
          }

          setCalculationValue((prev) => {
            let newValue = prev;
            switch (operator) {
              case "+":
                newValue += number;
                break;
              case "-":
                newValue -= number;
                break;
              case "/":
                newValue /= number;
                break;
              case "*":
                newValue *= number;
                break;
              default:
                newValue = number;
            }
            return Math.max(1, Math.round(newValue * 100) / 100);
          });

          return {
            ...pos,
            brightness: 0.3,
            touched: true,
          };
        }
        return pos;
      });
    };

    const collisionInterval = setInterval(checkCollision, 100);
    return () => clearInterval(collisionInterval);
  }, [centerY, gamePhase]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Battle sequence manager
  useEffect(() => {
    if (gamePhase !== "FishInOcean-pearls-passed") return;

    // Phase 1: Reset left fish to initial position
    setFishPosition({ x: 5, y: 50 });

    // After reset completes, start battle
    const timer = setTimeout(() => {
      setGamePhase("FishInOcean-fish-battle");
    }, 800); // Match this with CSS transition duration

    return () => clearTimeout(timer);
  }, [gamePhase]);

  // Battle animation effect
  useEffect(() => {
    if (gamePhase !== "FishInOcean-fish-battle" || battlePaused) return;

    const easingFactor = 0.05;
    const oscillationAmount = 1.5;

    let currentFishX = 5;
    let currentDarkFishX = 95;

    const animateBattle = () => {
      // Calculate new positions with easing
      currentFishX += (50 - currentFishX) * easingFactor;
      currentDarkFishX -= (currentDarkFishX - 50) * easingFactor;

      // Calculate vertical oscillation
      const now = Date.now();
      const oscillationY = Math.sin(now / 600) * oscillationAmount;

      // Update positions with oscillation
      setFishPosition({
        x: currentFishX,
        y: 50 + oscillationY,
      });

      setDarkFishPosition({
        x: currentDarkFishX,
        y: 50 - oscillationY,
        visible: true,
      });

      // Continuously check for collisions
      checkFishCollision();

      // Continue animation unless game phase has changed
      if (gamePhase === "FishInOcean-fish-battle" && !battlePaused) {
        battleAnimationRef.current = requestAnimationFrame(animateBattle);
      }
    };

    battleAnimationRef.current = requestAnimationFrame(animateBattle);

    return () => {
      if (battleAnimationRef.current) {
        cancelAnimationFrame(battleAnimationRef.current);
      }
    };
  }, [gamePhase, calculationValue, darkCalculationValue, battlePaused]);

  // Check when all pearls have passed
  useEffect(() => {
    const checkAllPearlsPassed = setInterval(() => {
      if (
        gamePhase === "FishInOcean-collecting-pearls" &&
        checkPearlsPassed()
      ) {
        setGamePhase("FishInOcean-pearls-passed"); // New phase before battle starts
      }
    }, 500);

    return () => clearInterval(checkAllPearlsPassed);
  }, [gamePhase]);

  // Pearl animation effect
  useEffect(() => {
    const movePearls = () => {
      pearlPositionsRef.current = pearlPositionsRef.current.map((pos) => ({
        ...pos,
        left: pos.left - 2,
      }));

      setFishPosition((prev) => ({ ...prev })); // Force re-render

      pearlAnimationRef.current = requestAnimationFrame(movePearls);
    };

    pearlAnimationRef.current = requestAnimationFrame(movePearls);
    return () => {
      if (pearlAnimationRef.current) {
        cancelAnimationFrame(pearlAnimationRef.current);
      }
    };
  }, []);

  return (
    <div
      className="FishInOcean-fish-covr"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <Bubbles />
      <div className="FishInOcean-timer">Time: {timeLeft}s</div>

      {/* Kill Animation */}
      {showKillAnimation && (
        <div
          className="FishInOcean-kill-animation"
          style={{
            left: `${killAnimationPosition.x}%`,
            top: `${killAnimationPosition.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 20,
          }}
        >
          <img src="/animation.svg" alt="kill effect" />
        </div>
      )}

      {/* Game Over Popup */}
      {gameOver.show && (
        <div className="FishInOcean-game-over-popup">
          <div
            className={`game-over-content ${
              gameOver.isWin ? "FishInOcean-win" : "FishInOcean-lose"
            }`}
          >
            <h2>{gameOver.message}</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}

      {/* Player Fish */}
      <div
        className={`FishInOcean-left-side-cover ${
          gamePhase === "FishInOcean-dark-wins" ||
          gamePhase === "FishInOcean-tie"
            ? "FishInOcean-fish-defeated"
            : ""
        }`}
        ref={fishRef}
        style={{
          left: `${fishPosition.x}%`,
          top: `${fishPosition.y}%`,
          transform: "translate(-50%, -50%)",
          transition:
            gamePhase === "collecting-pearls"
              ? "left 0.5s ease-out, top 0.5s ease-out"
              : gamePhase === "pearls-passed"
              ? "left 0.8s ease-out, top 0.8s ease-out"
              : "left 0.1s linear, top 0.8s ease-out", // Faster transition when killed
          zIndex: 10,
          display: fishPosition.x <= -20 ? "none" : "flex", // Hide immediately when off screen
        }}
      >
        {" "}
        <div className="FishInOcean-calculation-label">
          <div className="FishInOcean-value">{calculationValue}</div>
        </div>
        <div className="FishInOcean-fishes">
          <div className="FishInOcean-large-fish">
            <img src="/large-fish.svg" width="150px" alt="" />
          </div>
          <div className="FishInOcean-small_fishes">
            <img
              src="/small-fish.svg"
              width="50px"
              className="FishInOcean-small-fish1"
            />
            <img
              src="/small-fish.svg"
              width="50px"
              className="FishInOcean-small-fish2"
            />
          </div>
        </div>
      </div>

      {/* Dark Fish */}
      <div
        className={`FishInOcean-right-side-cover ${
          gamePhase === "FishInOcean-player-wins" ||
          gamePhase === "FishInOcean-tie"
            ? "FishInOcean-fish-defeated"
            : ""
        }`}
        ref={darkFishRef}
        style={{
          left: `${darkFishPosition.x}%`,
          top: `${darkFishPosition.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: darkFishPosition.visible ? 1 : 0,
          transition:
            gamePhase === "fish-battle"
              ? "left 2s linear, top 0.8s ease-out, opacity 0.1s ease-out" // Faster opacity transition
              : "opacity 0.1s ease-out", // Faster opacity transition
          zIndex: 10,
        }}
      >
        <div className="FishInOcean-dark-calculation-label">
          <div className="FishInOcean-value">{darkCalculationValue}</div>
        </div>
        <div className="FishInOcean-fishes">
          <div className="FishInOcean-large-dark-fish">
            <img src="/large-dark-fish.svg" width="150px" alt="" />
          </div>
          <div className="FishInOcean-small_fishes">
            <img
              src="/small-dark-fish.svg"
              width="50px"
              className="FishInOcean-small-fish1"
            />
            <img
              src="/small-dark-fish.svg"
              width="50px"
              className="FishInOcean-small-fish2"
            />
          </div>
        </div>
      </div>

      {/* Pearls */}
      {pearlPositionsRef.current.map((pearl, index) => (
        <div
          key={`${pearl.pairId}-${index}`}
          className="FishInOcean-pearl-column"
          style={{
            position: "absolute",
            left: `${pearl.left}px`,
            top: `calc(50% + ${pearl.top}px)`,
            transform: "translateY(-50%)",
            zIndex: 5,
            opacity:
              touchedPairsRef.current.has(pearl.pairId) && !pearl.touched
                ? 0.5
                : 1,
          }}
        >
          <div
            className="FishInOcean-egg-pearl"
            style={{
              filter: `brightness(${pearl.brightness})`,
              transition: "filter 0.3s ease",
            }}
          >
            <img
              src="/egg_cover.svg"
              alt=""
              className="FishInOcean-egg_cover"
            />
            <img src="/egg.svg" alt="" className="FishInOcean-egg" />
            <div
              className="FishInOcean-eggnumber"
              style={{ color: "rgb(25, 3, 46)" }}
            >
              {pearl.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Homepage;
