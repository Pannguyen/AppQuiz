import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

     // useState() on donne n'imp quelle valuer dans (), l'envoie un arrete de 2 valeurs [valeur, fonctPOurSetLaaValeur]
  //  est un hook qui permet d’ajouter le state local React à des composants fonctions.
  //useEffect : recupere deux prm, recuper une fonct et un arrte[], avec le principle de watch, quand on lance 2e parametre, 
  //il regarde 1e premier et le lancer.// 
  //fonction qui envoie le HTML 
  
function App() {
  const [data, setData] = useState([]);
  var [selectedQuizIndex, setSelectedQuizIndex] = useState(-1);
  var [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  var [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  var [score, setScore] = useState(0);
  var [quizFinished, setQuizFinished] = useState(false);


  //Incrmenter le point chaque fois//
  const incrementScore = (num) => {
    setScore(score + num);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch('http://localhost:3000/quiz');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuiz();
  }, []);
  /*   const handleChoiceClick = (element) => {
      if (selectedQuizIndex === -1) return;
  
      const selectionChoice = element.target;
      const selectionAnswer = selectionChoice.dataset.number;
      const classToApply =
        selectionAnswer ===
          data[selectedQuizIndex].rounds[selectedAnswerIndex].corrects[0]
          ? 'correct'
          : 'incorrect';
      selectionChoice.classList.add(classToApply);
      if (classToApply === 'correct') {
        incrementScore();
      }
      else {
        selectionChoice.classList.add("incorrect");
      }
    }; */


  // mettre à jour l'index du quiz,
  //réinitialiser le score à 0.
  const handleQuizSelection = (index) => {
    setSelectedQuizIndex(index);
    setScore(0); 
  };

  const handleAnswerClick = (roundIndex, answerIndex) => {
    const selectedQuiz = data[selectedQuizIndex];
    const selectedRound = selectedQuiz.rounds[roundIndex];
    const isCorrect = selectedRound.corrects.includes(answerIndex);

    setSelectedAnswerIndex(answerIndex);

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button) => {
      button.classList.remove('selected', 'correct', 'incorrect');
    });

    

    const selectedButton = document.getElementById(`answer-${roundIndex}-${answerIndex}`);
    selectedButton.classList.add('selected');
    if (isCorrect) {
      incrementScore(1); 
    }

    const isLastQuestion = roundIndex === selectedQuiz.rounds.length - 1;
    if (isLastQuestion) {
      const isLastQuiz = selectedQuizIndex === data.length - 1;
      if (!isLastQuiz) {
        setSelectedQuizIndex(selectedQuizIndex + 1);
        setSelectedQuestionIndex(0);
        setSelectedAnswerIndex(-1);
        //setScore(0); // Réinitialise le score pour le prochain quiz
      } else {
        setQuizFinished(true);
      }
    } else {
      setSelectedQuestionIndex(roundIndex + 1);
      setSelectedAnswerIndex(-1);
    }

    if (isCorrect) {
      selectedButton.classList.add('correct');
    } else {
      selectedButton.classList.add('incorrect');
    }
  };

  const questionSelection = () => {
    if (selectedQuizIndex === -1) return null;

    const selectedQuiz = data[selectedQuizIndex];
    const selectedRound = selectedQuiz.rounds[selectedQuestionIndex];
    if (!selectedRound) return null;
    return (
      <div>
        <h3>Question</h3>
        <p>{selectedRound.questions}</p>
        {selectedRound.reponses.map((answer, answerIndex) => (
          <button
            key={answerIndex}
            id={`answer-${selectedQuestionIndex}-${answerIndex}`}
            onClick={() => handleAnswerClick(selectedQuestionIndex, answerIndex)}
            className={`btn ${answerIndex === selectedAnswerIndex ? 'selected' : ''}`}
          >
            {answer}
          </button>
        ))}
      </div>
    );
  };


  const handleQuizExit = () => {
    setSelectedQuizIndex(-1);
    setSelectedQuestionIndex(0);
    setSelectedAnswerIndex(-1);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="App">
      {selectedQuizIndex === -1 ? (
        <>
          <h2>Choisissez un quiz :</h2>
          {data.map((element, index) => (
            <button
              key={element._id}
              type="btn"
              onClick={() => handleQuizSelection(index)}
            >
              {element.nom}
            </button>
          ))}
        </>
      ) : (
        <>
          <h2>Quiz {selectedQuizIndex + 1}: {data[selectedQuizIndex].nom}</h2>
          {!quizFinished ? (
            <>
              {questionSelection()}
              <p>Score: {score}</p>
            </>
          ) : (
            <>
              <h3>Quiz terminé!</h3>
              <p>Score final: {score}</p>
            </>
          )}
          <button onClick={handleQuizExit}>Quitter le quiz</button>
        </>
      )}
    </div>
  );
}

export default App;





