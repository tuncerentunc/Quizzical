import { decode } from "html-entities"

function QuestionBlock(props) {
    const selectedAnswer = props.selectedAnswer[props.questionId]
    const correctAnswer = props.correctAnswer
    
    // renders the answers
    const answerElements = props.answerAll.map((answer, index) => {
        
        let answerClassName
        // class for each selection
        if (answer === selectedAnswer) answerClassName = "selected-answer"
        
        // set classes after checking the answers
        // correct answer
        if (answer === correctAnswer && props.isGameOver) {
        // incorrect selection
        } else if (answer !== correctAnswer && answer === selectedAnswer && props.isGameOver) {
            answerClassName = "incorrect-answer"
        // rest of the answers
        } else if (props.isGameOver) {
            answerClassName = "other-answers"
        }
        
        return (
            <p
                key={`${props.questionId}${index}`}
                className={`questionblock--answer-text ${answerClassName}`}
                onClick={() => props.isGameOver === false && props.setSelectedAnswer(prevState => {
                    return {...prevState, [props.questionId]: answer}
                })}
            >
            {decode(answer)}
            </p>
        )
    })
    
    return (
        <div className="questionblock">
            <p className="questionblock--question-text">{props.questionText}</p>
            <div className="questionblock--answers-container">
                {answerElements}
            </div>
        </div>
    )
}

export default QuestionBlock