import React from 'react';
import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react18';
import 'bootstrap/dist/css/bootstrap.min.css';

describe('Quiz Component', () => {
  beforeEach(() => {
    // Stub the API call to return mock data
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    
    // Mount the component
    mount(<Quiz />);
  });

  it('should display the start quiz button', () => {
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should start the quiz when button is clicked', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    // Should now show the first question
    cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
  });

  it('should show four answer options for each question', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    cy.get('.alert.alert-secondary').should('have.length', 4);
  });

  it('should move to the next question after answering', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    // Click on answer 2 (which is correct for the first question)
    cy.get('.btn.btn-primary').eq(1).click();
    
    // Should now show the second question
    cy.get('h2').should('contain', 'Which of the following is a mutable data type in Python?');
  });

  it('should display the final score when all questions are answered', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    // Answer all questions (3 in our mock data)
    cy.get('.btn.btn-primary').eq(1).click(); // First question: answer 2 (correct)
    cy.get('.btn.btn-primary').eq(2).click(); // Second question: answer 3 (correct)
    cy.get('.btn.btn-primary').eq(2).click(); // Third question: answer 3 (correct)
    
    // Should now show the final score
    cy.get('h2').should('contain', 'Quiz Completed');
    cy.get('.alert.alert-success').should('contain', 'Your score: 3/3');
  });

  it('should allow starting a new quiz after completion', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    // Answer all questions
    cy.get('.btn.btn-primary').eq(1).click();
    cy.get('.btn.btn-primary').eq(2).click();
    cy.get('.btn.btn-primary').eq(2).click();
    
    // Start a new quiz
    cy.get('button').contains('Take New Quiz').click();
    cy.wait('@getQuestions');
    
    // Should show the first question again
    cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
  });
});