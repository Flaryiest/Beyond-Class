import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import '../style/Test.css';

const TestPage = () => {

    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [quiz, setQuiz] = useState([])
    const [results, setResults] = useState([])
    const [render, triggerRender] = useState(0)
    const params = useParams()

    useEffect(() => {
        const createTest = async () => {
            const response = await fetch("http://184.64.116.12:3333" + "/generate/exam", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: params.userID, course: params.testID }),
            });
            if (response) {
                console.log("Test generated", response)
                triggerRender(prevState => prevState + 1)
            }
        }
        createTest();
    }, []);

    useEffect(() => {
        const getTest = async () => {
            const response = await fetch("http://184.64.116.12:3333" + "/get_courses", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: params.userID }),
            });
            if (response) {
                const courses = await response.json();
                const currentCourse = courses[params.testID]["quizzes"]
                console.log(currentCourse)
                const currentCourseQuizzes = Object.entries(currentCourse)
                const [currentQuiz] = currentCourseQuizzes.slice(-1)
                setQuiz(currentQuiz[1]);
            }
        }
        getTest();
    }, [render]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = quiz.map((question, index) => {
            const isCorrect = answers[index] === question.answers[question.correct];
            return { question: question.question, correct: isCorrect, correctAnswer: question.answers[question.correct] };
        });
        setResults(result);
        setSubmitted(true);
    };

    return (
        <div className="test-container">
            <h1 className="test-header">Test</h1>
            
            {!submitted ? (
                <form onSubmit={handleSubmit}>
                    {quiz.map((question, index) => (
                        <div key={index} className="question-card">
                            <h2>{question.question}</h2>
                            <div className="options">
                                {Object.entries(question.answers).map(([key, option]) => (
                                    <label key={key} className="option">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            checked={answers[index] === option}
                                            onChange={() => handleAnswerChange(index, option)}
                                            required
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            ) : (
                <div className="results-container">
                    <h2>Your Results</h2>
                    {results.map((result, index) => (
                        <div key={index} className="result-card">
                            <h3>{result.question}</h3>
                            <p>
                                Your answer: {answers[index]} <br />
                                {result.correct ? (
                                    <span className="correct-answer">Correct!</span>
                                ) : (
                                    <>
                                        <span className="incorrect-answer">Incorrect.</span> <br />
                                        Correct answer: {result.correctAnswer}
                                    </>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestPage;