import React from 'react'
import { useLocation } from 'react-router-dom'
import '../style/TestResults.css'

const TestResults = () => {
    console.log("test")
    const questionsList = [
        {
          id: 1,
          question: 'What is the capital of France?',
          options: ['Paris', 'Berlin', 'Madrid', 'Rome'],
          correctAnswer: 'Paris',
          explanation: 'Paris is the capital and most populous city of France.'
        },
        {
          id: 2,
          question: 'What is the largest planet in our solar system?',
          options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
          correctAnswer: 'Jupiter',
          explanation: 'Jupiter is the largest planet in the solar system.'
        },
        {
          id: 3,
          question: 'Which element has the chemical symbol O?',
          options: ['Oxygen', 'Gold', 'Iron', 'Hydrogen'],
          correctAnswer: 'Oxygen',
          explanation: 'O is the chemical symbol for Oxygen, which is vital for respiration.'
        }
    ]

    const location = useLocation()
    const { answers } = location.state || {}

    return (
        <div className="results-container">
        <h1 className="results-header">Results</h1>
        {questionsList.map((question) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer

            return (
            <div key={question.id} className="result-card">
                <h2>{question.question}</h2>
                <p><strong>Your Answer:</strong> {userAnswer}</p>
                <p style={{ color: isCorrect ? 'green' : 'red' }}>
                {isCorrect ? 'Correct' : 'Wrong'}
                </p>
                {!isCorrect && (
                <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                )}
                <p><strong>Explanation:</strong> {question.explanation}</p>
            </div>
            )
        })}
        </div>
    )
    }

    export default TestResults