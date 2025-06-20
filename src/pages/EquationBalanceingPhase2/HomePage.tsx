import { useDrag, useDrop } from "react-dnd";
import { useState, useEffect } from "react";
import "./Homepage.css";

interface Card {
  id: number;
  title: string;
  image: string;
  value: string;
  unit?: string;
  numericValue?: number;
}

interface DraggedItem {
  id: number;
  type: string;
}

// Main units with their conversion factors to smallest unit
const mainUnits: Card[] = [
  {
    id: 1,
    title: "Kilometer",
    image: "/card/kilometer.svg",
    value: "1 km",
    unit: "kilometer",
    numericValue: 1000000, // 1 km = 1000000 mm
  },
  {
    id: 2,
    title: "Kilogram",
    image: "/card/kilogram.svg",
    value: "1 kg",
    unit: "kilogram",
    numericValue: 1000000, // 1 kg = 1000000 mg
  },
  {
    id: 3,
    title: "Kiloliter",
    image: "/card/kiloliter.svg",
    value: "1 kl",
    unit: "kiloliter",
    numericValue: 1000000, // 1 kl = 1000000 ml
  },
  {
    id: 4,
    title: "Hour",
    image: "/card/hours-ninutes.svg",
    value: "1 hr",
    unit: "hour",
    numericValue: 3600000, // 1 hr = 3600000 ms
  },
];

// Conversion data for each unit type
const unitConversions = {
  kilometer: {
    name: "millimeter",
    symbol: "mm",

    parts: [
      { value: 500000, title: "500000 mm", image: "/card/kilometer.svg" },
      { value: 300000, title: "300000 mm", image: "/card/kilometer.svg" },
      { value: 200000, title: "200000 mm", image: "/card/kilometer.svg" },
      { value: 100000, title: "100000 mm", image: "/card/kilometer.svg" },
      { value: 50000, title: "50000 mm", image: "/card/kilometer.svg" },
      { value: 50000, title: "50000 mm", image: "/card/kilometer.svg" },
    ],
  },
  kilogram: {
    name: "milligram",
    symbol: "mg",

    parts: [
      { value: 500000, title: "500000 mg", image: "/card/kilogram.svg" },
      { value: 300000, title: "300000 mg", image: "/card/kilogram.svg" },
      { value: 200000, title: "200000 mg", image: "/card/kilogram.svg" },
      { value: 100000, title: "100000 mg", image: "/card/kilogram.svg" },
      { value: 50000, title: "50000 mg", image: "/card/kilogram.svg" },
      { value: 50000, title: "50000 mg", image: "/card/kilogram.svg" },
    ],
  },
  kiloliter: {
    name: "milliliter",
    symbol: "ml",

    parts: [
      { value: 500000, title: "500000 ml", image: "/card/kiloliter.svg" },
      { value: 300000, title: "300000 ml", image: "/card/kiloliter.svg" },
      { value: 200000, title: "200000 ml", image: "/card/kiloliter.svg" },
      { value: 100000, title: "100000 ml", image: "/card/kiloliter.svg" },
      { value: 50000, title: "50000 ml", image: "/card/kiloliter.svg" },
      { value: 50000, title: "50000 ml", image: "/card/kiloliter.svg" },
    ],
  },
  hour: {
    name: "millisecond",
    symbol: "ms",
    parts: [
      { value: 1800000, title: "1800000 ms", image: "/card/hours-ninutes.svg" },
      { value: 1200000, title: "1200000 ms", image: "/card/hours-ninutes.svg" },
      { value: 600000, title: "600000 ms", image: "/card/hours-ninutes.svg" },
      { value: 300000, title: "300000 ms", image: "/card/hours-ninutes.svg" },
      { value: 120000, title: "120000 ms", image: "/card/hours-ninutes.svg" },
      { value: 180000, title: "180000 ms", image: "/card/hours-ninutes.svg" },
    ],
  },
};

const Homrpage = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedUnit, setSelectedUnit] = useState<string>("kilometer"); // Set kilometer as default
  const [cards, setCards] = useState<Card[]>([]);
  const [leftSideCards, setLeftSideCards] = useState<Card[]>([]);
  const [rightSideCards, setRightSideCards] = useState<Card[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentUnitSymbol, setCurrentUnitSymbol] = useState("mm"); // Set mm as default
  const [moveCount, setMoveCount] = useState(0); // Track number of moves

  // Initialize with kilometer selected
  useEffect(() => {
    handleUnitSelect("kilometer");
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Timer ended - automatically show the modal
      handlecheckbalance();
    }
  }, [timeLeft]);

  // When a main unit is selected
  const handleUnitSelect = (unit: string) => {
    const selectedMainUnit = mainUnits.find((u) => u.unit === unit);
    if (!selectedMainUnit) return;

    setSelectedUnit(unit);
    setLeftSideCards([selectedMainUnit]);
    setRightSideCards([]); // Clear right side when unit changes
    setMoveCount(0); // Reset move counter when unit changes

    // Set the current unit symbol
    const symbol = unitConversions[unit as keyof typeof unitConversions].symbol;
    setCurrentUnitSymbol(symbol);

    // Generate the smaller unit cards
    const parts = unitConversions[unit as keyof typeof unitConversions].parts;
    const generatedCards = parts.map((part, index) => ({
      id: index + 101,
      title: part.title,
      image: part.image,
      value: part.title,
      numericValue: part.value,
    }));

    setCards(generatedCards);
  };

  const calculateTotalWeight = (sideCards: Card[]) => {
    return sideCards.reduce((sum, card) => sum + (card.numericValue || 0), 0);
  };

  const generateEquation = (sideCards: Card[]) => {
    if (sideCards.length === 0) return "0";
    return sideCards.map((card) => card.value).join(" + ");
  };

  const calculateRotation = () => {
    const leftValue = calculateTotalWeight(leftSideCards);
    const rightValue = calculateTotalWeight(rightSideCards);
    const difference = Math.abs(leftValue - rightValue);
    const maxRotation = 15;

    // Adjust sensitivity based on the unit
    let divisor = 100000;
    if (selectedUnit === "hour") divisor = 1000000;

    if (leftValue > rightValue) {
      const rotation = Math.min(maxRotation, difference / divisor);
      return `-${rotation}deg`;
    } else if (rightValue > leftValue) {
      const rotation = Math.min(maxRotation, difference / divisor);
      return `${rotation}deg`;
    }
    return "0deg";
  };

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: DraggedItem, monitor) => {
      const droppedCard = cards.find((card) => card.id === item.id);
      if (!droppedCard) return;

      const clientOffset = monitor.getClientOffset();
      const balanceHolder = document
        .querySelector(".phase-2-balance-Holder")
        ?.getBoundingClientRect();

      if (balanceHolder && clientOffset) {
        const isLeftSide =
          clientOffset.x < balanceHolder.left + balanceHolder.width / 2;

        if (isLeftSide) {
          setLeftSideCards((prev) => [...prev, droppedCard]);
        } else {
          setRightSideCards((prev) => [...prev, droppedCard]);
        }

        setCards((prevCards) =>
          prevCards.filter((card) => card.id !== item.id)
        );
        setMoveCount((prev) => prev + 1);
      }
    },
  });

  const removeCardFromSide = (side: "left" | "right", cardId: number) => {
    if (side === "left") {
      const cardToRemove = leftSideCards.find((card) => card.id === cardId);
      if (cardToRemove) {
        setLeftSideCards(leftSideCards.filter((card) => card.id !== cardId));
        setCards((prev) => [...prev, cardToRemove]);
        setMoveCount((prev) => prev + 1);
      }
    } else {
      const cardToRemove = rightSideCards.find((card) => card.id === cardId);
      if (cardToRemove) {
        setRightSideCards(rightSideCards.filter((card) => card.id !== cardId));
        setCards((prev) => [...prev, cardToRemove]);
        setMoveCount((prev) => prev + 1);
      }
    }
  };

  const leftTotal = calculateTotalWeight(leftSideCards);
  const rightTotal = calculateTotalWeight(rightSideCards);
  const leftEquation = generateEquation(leftSideCards);
  const rightEquation = generateEquation(rightSideCards);

  const handlecheckbalance = () => {
    if (leftTotal === rightTotal) {
      setModalMessage("🎉 Perfect Balance! Both sides are equal! 🎉");
    } else if (leftTotal > rightTotal) {
      setModalMessage("👈 Left side is heavier! 👈");
    } else {
      setModalMessage("👉 Right side is heavier! 👉");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetGame = () => {
    setTimeLeft(60);
    setShowModal(false);
    handleUnitSelect(selectedUnit); // This will reset the game state
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleUnitSelect(e.target.value);
  };

  return (
    <div className="phase-2-cover">
      <div className="phase-2-bgnd">
        <img src="/background.svg" alt="" className="phase-2-img" />
      </div>

      {/* Top info bar */}
      <div className="phase-2-top-info-bar">
        {/* Move counter */}
        <div
          className="phase-2-move-counter"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Moves: {moveCount}
        </div>
        {/* Unit selector dropdown */}
        <select
          className="phase-2-form-select"
          aria-label="Select unit"
          onChange={handleSelectChange}
          value={selectedUnit}
          style={{ width: "200px" }}
        >
          <option value="">Select a unit</option>
          {mainUnits.map((unit) => (
            <option key={unit.id} value={unit.unit}>
              {unit.value} ({unit.unit})
            </option>
          ))}
        </select>
        {/* Timer display */}
        <div
          className="phase-2-timer"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Time Left: {timeLeft}s
        </div>
      </div>

      {showModal && (
        <div className="phase-2-modal-overlay">
          <div className="phase-2-modal-content">
            <div className="phase-2-modal-message">{modalMessage}</div>
            <div className="phase-2-modal-details">
              Left Total: {leftTotal} {currentUnitSymbol} | Right Total:{" "}
              {rightTotal} {currentUnitSymbol}
              <div className="phase-2-modal-card-values">
                <div>
                  <strong>Left Side:</strong>
                  {leftSideCards.map((card) => (
                    <div key={card.id}>{card.value}</div>
                  ))}
                </div>
                <div>
                  <strong>Right Side:</strong>
                  {rightSideCards.map((card) => (
                    <div key={card.id}>{card.value}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="phase-2-modal-buttons">
              <button
                className="btn phase-2-modal-close-btn rounded-circle"
                onClick={closeModal}
              >
                <i className="phase-2-bi bi-x fs-2"></i>
              </button>
              <button
                className="phase-2-modal-play-again-btn"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="phase-2-center-weight-display">
        <div className="phase-2-weight-value left-weight">
          {leftEquation} = {leftTotal} {currentUnitSymbol}
        </div>
        <div className="phase-2-weight-value right-weight">
          {rightEquation} = {rightTotal} {currentUnitSymbol}
        </div>
      </div>
      <div className="phase-2-balancer-cover">
        <div className="phase-2-stand">
          <img
            src="/balancer-center-bass-stand.svg"
            className="phase-2-center-base-stand"
          />
          <div
            ref={drop as any}
            className="phase-2-balance-Holder"
            style={{
              transform: `rotate(${calculateRotation()})`,
              transformOrigin: "center center",
            }}
          >
            <div className="phase-2-left-side">
              <img
                src="/balance-left.svg"
                alt="balance-left"
                className="phase-2-balance-left"
              />
              <div className="phase-2-left-cards-container">
                {leftSideCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="phase-2-left-balance-card-img"
                    style={{
                      transform: `rotate(${
                        index < leftSideCards.length / 2
                          ? -(index + 1) * 5
                          : (index + 1) * 5
                      }deg)`,
                      zIndex: index,
                      left: `${index * 15}px`,
                    }}
                    onClick={() => removeCardFromSide("left", card.id)}
                  >
                    <div className="phase-2-card-value">{card.value}</div>
                    <img
                      src={card.image}
                      width="80px"
                      height="80px"
                      alt="balance-card"
                      className="phase-2-card-img"
                    />
                  </div>
                ))}
              </div>
            </div>

            <img src="/balance-Holder.svg" className="w-100" />

            <div className="phase-2-right-side">
              <img
                src="/balance-right.svg"
                alt="balance-right"
                className="phase-2-balance-right"
              />
              <div className="phase-2-right-cards-container">
                {rightSideCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="phase-2-right-balance-card-img"
                    style={{
                      transform: `rotate(${
                        index < rightSideCards.length / 2
                          ? (index + 1) * 5
                          : -(index + 1) * 5
                      }deg)`,
                      zIndex: index,
                      right: `${index * 10}px`,
                    }}
                    onClick={() => removeCardFromSide("right", card.id)}
                  >
                    <div className="phase-2-card-value">{card.value}</div>
                    <img
                      src={card.image}
                      width="80px"
                      height="80px"
                      alt="balance-card"
                      className="phase-2-card-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="phase-2-persons-container">
        <img src="/child.svg" alt="child" className="phase-2-" />
        <div className="phase-2-oldie-message-container">
          <div className="phase-2-message">
            <img src="/oldie-message.svg" alt="" className="phase-2-" />
            <div className="phase-2-text">
              {selectedUnit
                ? `Drag ${
                    unitConversions[
                      selectedUnit as keyof typeof unitConversions
                    ].name
                  } pieces to balance the scale!`
                : "Select a unit type to begin!"}
            </div>
          </div>
          <img src="/oldie.svg" alt="oldie" className="phase-2-" />
        </div>
      </div>

      <div className="phase-2-card-container">
        {cards.map((item) => (
          <DraggableCard key={item.id} card={item} />
        ))}
      </div>
    </div>
  );
};

const DraggableCard: React.FC<{ card: Card }> = ({ card }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id: card.id, type: "CARD" } as DraggedItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className="phase-2-custom-card-with-value"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <div className="phase-2-card-value">{card.value}</div>
      <img src={card.image} alt="" />
    </div>
  );
};

export default Homrpage;
