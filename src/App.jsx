import React from "react"
import StartScreen from "./Components/StartScreen.jsx"
import RenderQuestionBlock from "./Components/QuestionBlock.jsx"
import { decode } from "html-entities"

function App() {
    const [questionBlocks, setQuestionBlocks] = React.useState([])  // current questions with answers
    const [selectedAnswers, setSelectedAnswers] = React.useState([])  // selected answers
    const [isStarted, setIsStarted] = React.useState(false)         // first screen state
    const [isGameOver, setIsGameOver] = React.useState(false)       // answer check state
    const [restart, setRestart] = React.useState(false)             // if true, button restarts the game
    const [correctAnswerCount, setCorrectAnswerCount] = React.useState(0)  // correct answers count
    
    // questions jsx array to be rendered
    const questionBlockElements = questionBlocks.map((questionBlock, index) => {
        return <RenderQuestionBlock
            key={index}
            questionId={index}
            questionText={questionBlock.questionText}
            answerAll={questionBlock.answerAllRandomOrder}
            correctAnswer={questionBlock.answerCorrect}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            isGameOver={isGameOver}
        />        
    })
    
    // fetches question data
    React.useEffect(() => {
        fetch(`https://opentdb.com/api.php?amount=5&category=15&type=multiple`)
            .then(res => res.json())
            .then(data => {
                const questionBlocks = data.results.map(result => {
                    const questionText = decode(result.question);
                    const answerCorrect = result.correct_answer;
                    const answerAll = [answerCorrect, ...result.incorrect_answers]
                    const answersRandomOrdered = randomizeOrder(answerAll)
                    
                    return createQuestionBlocks(questionText, answerCorrect, answersRandomOrdered)
                })
                setQuestionBlocks(questionBlocks)
            })
    }, [restart])
    
    // creates a new question set from fetched data
    function createQuestionBlocks(questionText, answerCorrect, answerAllRandomOrder=[]) {
        return {
            questionText: questionText,
            answerCorrect: answerCorrect,
            answerAllRandomOrder: answerAllRandomOrder,
        }
    }
    
    // randomizes order of answers
    function randomizeOrder(answerAll) {
        
        const answerAllRandomOrder = []
        while (answerAll.length > 0) {
            const randomNum = Math.floor(Math.random() * answerAll.length);
            answerAllRandomOrder.push(answerAll[randomNum])
            answerAll.splice(randomNum, 1);
        }
        
        return answerAllRandomOrder;
    }
    
    function checkAnswers() {
        setIsGameOver(true)
        
        const correctPlayerAnswerArr = questionBlocks.filter((question, index) => {
            return question.answerCorrect === selectedAnswers[index]
        })
        
        setCorrectAnswerCount(correctPlayerAnswerArr.length)
    }

    function restartGame() {
      setRestart(prevState => {
        setIsGameOver(false)
        setSelectedAnswers("")
        return !prevState
      })
    }
    
    return (
        <>
            <div className="app--container">
                {isStarted === false && <StartScreen setIsStarted={setIsStarted}/>}
                {isStarted && questionBlockElements}
                <div className="app--button-container">
                    {
                    isGameOver &&
                    <p className="app--results">
                        You scored {correctAnswerCount}/{questionBlocks.length} correct answer{correctAnswerCount > 1 && "s"}
                    </p>
                    }
                    
                    {isStarted && 
                    <button 
                        className="check-btn"
                        onClick={isGameOver ? restartGame : checkAnswers}
                    >
                    {isGameOver ? "Restart" : "Check Answers"}
                    </button>
                    }
                </div>
            </div>
        </>
    )
}

export default App