import { useDrag, useDrop } from "react-dnd";
import { useState } from "react";
import "./Homrpage.css";

interface Card {
  id: number;
  title: string;
  image: string;
  value: string; // Changed from number to string to support "2x", "3", etc.
}

interface DraggedItem {
  id: number;
  type: string;
}

const initialCards: Card[] = [
  {
    id: 1,
    title: "Balance",
    image: "/card/card-child.svg",
    value: "2x",
  },
  {
    id: 2,
    title: "Balance",
    image: "/card/card-diamond.svg",
    value: "5x",
  },
  {
    id: 3,
    title: "Balance",
    image: "/card/card-child-2.svg",
    value: "10x",
  },
  {
    id: 4,
    title: "Balance",
    image: "/card/card-gold.svg",
    value: "3",
  },
  {
    id: 5,
    title: "Balance",
    image: "/card/card-child-2.svg",
    value: "-7",
  },
  {
    id: 6,
    title: "Balance",
    image: "/card/card-child-2.svg",
    value: "1x",
  },
  {
    id: 7,
    title: "Balance",
    image: "/card/card-gold.svg",
    value: "-4",
  },
  {
    id: 8,
    title: "Balance",
    image: "/card/card-gold.svg",
    value: "6x",
  },
  {
    id: 9,
    title: "Balance",
    image: "/card/card-child-2.svg",
    value: "9",
  },
];

const Homrpage = () => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [leftSideCards, setLeftSideCards] = useState<Card[]>([]);
  const [rightSideCards, setRightSideCards] = useState<Card[]>([]);

  // Function to calculate the numeric value based on the card's value string
  const getNumericValue = (value: string): number => {
    if (value.endsWith("x")) {
      return parseInt(value.replace("x", "")) * 1; // x has weight of 1
    } else if (value.endsWith("y")) {
      return parseInt(value.replace("y", "")) * 2; // y has weight of 2
    }
    return parseInt(value) || 0;
  };

  const calculateTotalWeight = (sideCards: Card[]) => {
    return sideCards.reduce(
      (sum, card) => sum + getNumericValue(card.value),
      0
    );
  };

  // Function to generate equation string for a side
  const generateEquation = (sideCards: Card[]) => {
    if (sideCards.length === 0) return "0";

    const equationParts = sideCards.map((card) => {
      const numValue = getNumericValue(card.value);
      return numValue >= 0 ? `+${numValue}` : `${numValue}`;
    });

    // Remove leading '+' if present
    if (equationParts[0].startsWith("+")) {
      equationParts[0] = equationParts[0].substring(1);
    }

    return equationParts.join(" ");
  };

  const calculateRotation = () => {
    const leftValue = calculateTotalWeight(leftSideCards);
    const rightValue = calculateTotalWeight(rightSideCards);

    const difference = Math.abs(leftValue - rightValue);
    const maxRotation = 15;

    if (leftValue > rightValue) {
      const rotation = Math.min(maxRotation, difference / 2); // Adjusted divisor for better sensitivity
      return `-${rotation}deg`;
    } else if (rightValue > leftValue) {
      const rotation = Math.min(maxRotation, difference / 2);
      return `${rotation}deg`;
    } else {
      return "0deg";
    }
  };

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: DraggedItem, monitor) => {
      const droppedCard = cards.find((card) => card.id === item.id);
      if (!droppedCard) return;

      const clientOffset = monitor.getClientOffset();
      const balanceHolder = document
        .querySelector(".phase-1-balance-Holder")
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
      }
    },
  });

  const removeCardFromSide = (side: "left" | "right", cardId: number) => {
    if (side === "left") {
      const cardToRemove = leftSideCards.find((card) => card.id === cardId);
      if (cardToRemove) {
        setLeftSideCards(leftSideCards.filter((card) => card.id !== cardId));
        setCards((prev) => [...prev, cardToRemove]);
      }
    } else {
      const cardToRemove = rightSideCards.find((card) => card.id === cardId);
      if (cardToRemove) {
        setRightSideCards(rightSideCards.filter((card) => card.id !== cardId));
        setCards((prev) => [...prev, cardToRemove]);
      }
    }
  };

  const leftTotal = calculateTotalWeight(leftSideCards);
  const rightTotal = calculateTotalWeight(rightSideCards);
  const leftEquation = generateEquation(leftSideCards);
  const rightEquation = generateEquation(rightSideCards);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handlecheckbalance = () => {
    if (leftTotal === rightTotal) {
      setModalMessage("🎉 Perfect Balance! Both sides are equal! 🎉");
    } else if (leftTotal > rightTotal) {
      const difference = leftTotal - rightTotal;
      if (difference < 5) {
        setModalMessage(
          "⚖️ Left side is slightly heavier! Almost balanced! ⚖️"
        );
      } else if (difference < 10) {
        setModalMessage("👈 Left side is noticeably heavier! 👈");
      } else {
        setModalMessage("🏋️‍♂️ Left side is MUCH heavier! 🏋️‍♂️");
      }
    } else {
      const difference = rightTotal - leftTotal;
      if (difference < 5) {
        setModalMessage(
          "⚖️ Right side is slightly heavier! Almost balanced! ⚖️"
        );
      } else if (difference < 10) {
        setModalMessage("👉 Right side is noticeably heavier! 👉");
      } else {
        setModalMessage("🏋️‍♀️ Right side is MUCH heavier! 🏋️‍♀️");
      }
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="phase-1-cover">
      <div className="phase-1-bgnd">
        <img src="/background.svg" alt="" className="phase-1-img" />
      </div>
      <button
        className="btn btn-warning position-absolute "
        style={{ zIndex: 100, top: "10px", right: "10px" }}
        onClick={handlecheckbalance}
      >
        Check balance
      </button>
      {showModal && (
        <div className="phase-1-modal-overlay">
          <div className="phase-1-modal-content">
            <div className="phase-1-modal-message">{modalMessage}</div>
            <div className="phase-1-modal-details">
              Left Total: {leftTotal} | Right Total: {rightTotal}
              <div className="phase-1-modal-card-values">
                <div>
                  <strong>Left Side:</strong>
                  {leftSideCards.map((card) => (
                    <div key={card.id}>
                      {card.value} (={getNumericValue(card.value)})
                    </div>
                  ))}
                </div>
                <div>
                  <strong>Right Side:</strong>
                  {rightSideCards.map((card) => (
                    <div key={card.id}>
                      {card.value} (={getNumericValue(card.value)})
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="phase-1-modal-close-btn  rounded-circle"
              onClick={closeModal}
            >
              <i className="bi bi-x fs-2"></i>
            </button>
          </div>
        </div>
      )}
      <div className="phase-1-balancer-cover">
        <div className="phase-1-stand">
          <img
            src="/balancer-center-bass-stand.svg"
            className="phase-1-center-base-stand"
          />
          <div
            ref={drop as any}
            className="phase-1-balance-Holder"
            style={{
              transform: `rotate(${calculateRotation()})`,
              transformOrigin: "center center",
            }}
          >
            <div className="phase-1-left-side">
              <img
                src="/balance-left.svg"
                alt="balance-left"
                className="phase-1-balance-left"
              />
              <div className="phase-1-left-cards-container">
                {leftSideCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="phase-1-left-balance-card-img"
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
                    <div className="phase-1-card-value">{card.value}</div>
                    <img
                      src={card.image}
                      width="80px"
                      height="80px"
                      alt="balance-card"
                      className="phase-1-card-img"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="phase-1-center-weight-display">
              <div className="phase-1-weight-value left-weight">
                {leftEquation} = {leftTotal}
              </div>
              <div className="phase-1-weight-value right-weight">
                {rightEquation} = {rightTotal}
              </div>
            </div>

            <img src="/balance-Holder.svg" className="w-100" />

            <div className="phase-1-right-side">
              <img
                src="/balance-right.svg"
                alt="balance-right"
                className="phase-1-balance-right"
              />
              <div className="phase-1-right-cards-container">
                {rightSideCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="phase-1-right-balance-card-img"
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
                    <div className="phase-1-card-value">{card.value}</div>
                    <img
                      src={card.image}
                      width="80px"
                      height="80px"
                      alt="balance-card"
                      className="phase-1-card-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="phase-1-persons-container">
        <img src="/child.svg" alt="child" className="phase-1-" />
        <div className="phase-1-oldie-message-container">
          <div className="phase-1-message">
            <img src="/oldie-message.svg" alt="" className="phase-1-" />
            <div className="phase-1-text">
              Drag math pieces onto the scales. make both sides equal!
              <br />
              Remember, power level is 2.
            </div>
          </div>

          <img src="/oldie.svg" alt="oldie" className="phase-1-" />
        </div>
      </div>

      <div className="phase-1-card-container">
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
      className="phase-1-custom-card-with-value"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <div className="phase-1-card-value">{card.value}</div>
      <img src={card.image} alt="" />
    </div>
  );
};

export default Homrpage;
