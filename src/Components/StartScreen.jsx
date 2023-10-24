function StartScreen(props) {
    return (
        <div className="start-screen">
            <h1 className="start-screen--title">Quizzical</h1>
            <p className="start-screen--info">Let's start!</p>
            <button className="start-screen--btn" onClick={() => props.setIsStarted(true)}>Start</button>
        </div>
    )
}

export default StartScreen