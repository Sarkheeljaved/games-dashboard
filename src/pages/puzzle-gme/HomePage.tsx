import { useState } from "react";
import "./Homepage.css";

interface PuzzleValues {
  value1: number;
  value2: number;
  operator: string;
}

interface PuzzleImage {
  id: number;
  src: string;
  values: PuzzleValues;
}

function HomePage() {
  const [answers, setAnswers] = useState<string[]>(Array(9).fill(""));
  const [showPuzzleImages, setShowPuzzleImages] = useState<boolean[]>(
    Array(9).fill(false)
  );
  const folder = 1;
  const completePuzzleImage: PuzzleImage[] = [
    {
      id: 1,
      src: `/${folder}/puzzle-1.svg`,
      values: {
        value1: 5,
        value2: 2,
        operator: "+",
      },
    },
    {
      id: 2,
      src: `/${folder}/puzzle-2.svg`,
      values: {
        value1: 4,
        value2: 9,
        operator: "-",
      },
    },
    {
      id: 3,
      src: `/${folder}/puzzle-3.svg`,
      values: {
        value1: 6,
        value2: 3,
        operator: "/",
      },
    },
    {
      id: 4,
      src: `/${folder}/puzzle-4.svg`,
      values: {
        value1: 5,
        value2: 1,
        operator: "*",
      },
    },
    {
      id: 5,
      src: `/${folder}/puzzle-5.svg`,
      values: {
        value1: 4,
        value2: 2,
        operator: "+",
      },
    },
    {
      id: 6,
      src: `/${folder}/puzzle-6.svg`,
      values: {
        value1: 5,
        value2: 8,
        operator: "-",
      },
    },
    {
      id: 7,
      src: `/${folder}/puzzle-7.svg`,
      values: {
        value1: 5,
        value2: 2,
        operator: "+",
      },
    },
    {
      id: 8,
      src: `/${folder}/puzzle-8.svg`,
      values: {
        value1: 15,
        value2: 2,
        operator: "+",
      },
    },
    {
      id: 9,
      src: `/${folder}/puzzle-9.svg`,
      values: {
        value1: 9,
        value2: 12,
        operator: "+",
      },
    },
  ];

  const calculateAnswer = (values: PuzzleValues): number => {
    const { value1, value2, operator } = values;
    switch (operator) {
      case "+":
        return value1 + value2;
      case "-":
        return value1 - value2;
      case "*":
        return value1 * value2;
      case "/":
        return value1 / value2;
      default:
        return 0;
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // Check if answer is correct
    const correctAnswer = calculateAnswer(completePuzzleImage[index].values);
    if (parseInt(value) === correctAnswer) {
      const newShowPuzzleImages = [...showPuzzleImages];
      newShowPuzzleImages[index] = true;
      setShowPuzzleImages(newShowPuzzleImages);
    } else {
      const newShowPuzzleImages = [...showPuzzleImages];
      newShowPuzzleImages[index] = false;
      setShowPuzzleImages(newShowPuzzleImages);
    }
  };

  return (
    <div className="puzzle-wrapper">
      <div className="navbar">
        <ul>
          <li className="score">SCORE: 33</li>
          <li className="time">TIME: 60</li>
        </ul>
      </div>
      <div className="full-img">
        <img src={`/${folder}/full-puzzle.svg`} alt="" className="" />
      </div>
      <div className="puzzle-content">
        <div className="puzzle-section">
          <div className="puzzle-playground">
            <div className="puzzle-playground-inner-cover">
              {completePuzzleImage.map((image, index) => (
                <img
                  className={`box`}
                  key={image.id}
                  src={showPuzzleImages[index] ? `${image.src}` : ""}
                  alt=""
                  style={{
                    visibility: showPuzzleImages[index] ? "visible" : "hidden",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="puzzle-rightbar shadow">
          <div className="top-bar">
            <div className="headding headding1">Puxxle Chunk</div>
            <div className="headding headding2">Problem</div>
          </div>

          {completePuzzleImage.map((data, index) => (
            <div className="right-sidebar-content" key={data.id}>
              <img src={`${data.src}`} alt="" />
              <div className="equation">
                <span>{data.values.value1}</span>
                <span>{data.values.operator}</span>
                <span>{data.values.value2}</span>
                <span>=</span>
              </div>
              <input
                type="number"
                className="form-control equation-input"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
