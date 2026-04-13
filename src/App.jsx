import React, { useState, useEffect } from "react";

const width = 8;
const blueCandy =
  "https://static.wikia.nocookie.net/candy-crush-saga/images/2/2d/BluecandyHTML5.png";
const greenArrow =
  "https://static.wikia.nocookie.net/candy-crush-saga/images/9/91/GreencandyHTML5.png";
const orangeCandy =
  "https://static.wikia.nocookie.net/candy-crush-saga/images/9/91/OrangecandyHTML5.png";
const purpleCandy =
  "https://static.wikia.nocookie.net/candy-crush-saga/images/e/eb/PurplecandyHTML5.png";
const redCandy =
  "https://static.wikia.nocookie.net/candy-crush-saga/images/4/45/RedcandyHTML5.png";
const yellowCandy =
  "https://static.wikia.nocookie.net/candy-crush-saga/images/2/24/YellowcandyHTML5.png";
const blank =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// Sound effects
const matchSound = new Audio('https://www.myinstants.com/media/sounds/bejeweled-match.mp3');
const noMatchSound = new Audio('https://www.myinstants.com/media/sounds/nope_P6AAmio.mp3');

const candyColors = [
  blueCandy,
  greenArrow,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfFour.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank,
        )
      ) {
        columnOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank),
        );
        matchSound.play().catch(() => {});
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 61, 62, 63,
      ];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank,
        )
      ) {
        rowOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank),
        );
        matchSound.play().catch(() => {});
        return true;
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfThree.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank,
        )
      ) {
        columnOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank),
        );
        matchSound.play().catch(() => {});
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
      ];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank,
        )
      ) {
        rowOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank),
        );
        matchSound.play().catch(() => {});
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }

      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = () => {
    if (!squareBeingDragged || !squareBeingReplaced) return;
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    const arrangement = [...currentColorArrangement];
    const draggedSrc = squareBeingDragged.getAttribute("src");
    const replacedSrc = squareBeingReplaced.getAttribute("src");
    
    arrangement[squareBeingReplacedId] = draggedSrc;
    arrangement[squareBeingDraggedId] = replacedSrc;

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ];

    const isValidMove = validMoves.includes(squareBeingReplacedId);

    // Manual check to see if swap creates a match before applying state
    const checkMatch = (arr) => {
      // Row check
      for (let i = 0; i < 64; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
        if (!notValid.includes(i)) {
          if (rowOfThree.every(sq => arr[sq] === arr[i] && arr[i] !== blank)) return true;
        }
      }
      // Col check
      for (let i = 0; i <= 47; i++) {
        const colOfThree = [i, i + width, i + width * 2];
        if (colOfThree.every(sq => arr[sq] === arr[i] && arr[i] !== blank)) return true;
      }
      return false;
    };

    if (isValidMove && checkMatch(arrangement)) {
      setCurrentColorArrangement(arrangement);
    } else {
      noMatchSound.play().catch(() => {});
    }
    setSquareBeingDragged(null);
    setSquareBeingReplaced(null);
  };

  const handleTouchStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.tagName === "IMG" && element.hasAttribute("data-id")) {
      setSquareBeingReplaced(element);
    }
  };

  useEffect(() => {
    if (squareBeingDragged && squareBeingReplaced) {
      dragEnd();
    }
  }, [squareBeingReplaced]);

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 200);
    return () => clearInterval(timer);
  }, [currentColorArrangement]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
