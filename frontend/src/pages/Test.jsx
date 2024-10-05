/* import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
function Test() {
    const [status, setStatus] = useState(false)
    const [testData, setTestData] = useState([])
    const params = useParams()

    useEffect(() => {
        const fetchTest = async () => {
            const response = await fetch()
            if (response.status == 200) {
                const test = await response.json()
                setTestData(test)
            }
        }
        fetchTest()
    }, []) */



import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../style/Test.css'


const TestPage = () => {

    const [answers, setAnswers] = useState({})
    const navigate = useNavigate()
    const params = useParams()
    const questionsList = [
        {
            id: 1,
            question: 'What is the capital of France?',
            options: ['Paris', 'Berlin', 'Madrid', 'Rome']
        },
        {
            id: 2,
            question: 'What is the largest planet in our solar system?',
            options: ['Earth', 'Mars', 'Jupiter', 'Saturn']
        },
        {
            id: 3,
            question: 'Which element has the chemical symbol O?',
            options: ['Oxygen', 'Gold', 'Iron', 'Hydrogen']
        }
        
        ]

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: selectedOption
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/user/' + params.userID + "/test/" + params.testID + "/answers", { state: { answers } });
    };

    return (
        <div className="test-container">
        <h1 className="test-header">Test</h1>
        <form onSubmit={handleSubmit}>
            {questionsList.map((question) => (
            <div key={question.id} className="question-card">
                <h2>{question.question}</h2>
                <div className="options">
                {question.options.map((option, index) => (
                    <label key={index} className="option">
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
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
        </div>
    )
    }

export default TestPage;