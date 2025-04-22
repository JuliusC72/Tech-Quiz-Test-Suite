describe('Tech Quiz Application', () => {
    beforeEach(() => {
      // Visit the app
      cy.visit('/');
      
      // Stub the API call to return consistent data for testing
      cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    });
  
    it('should load the application successfully', () => {
      // Verify the app loaded
      cy.get('.App').should('exist');
      cy.get('button').contains('Start Quiz').should('be.visible');
    });
  
    it('should start a new quiz when button is clicked', () => {
      // Start the quiz
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Verify quiz has started
      cy.get('h2').should('exist');
      cy.get('.alert.alert-secondary').should('have.length', 4);
    });
  
    it('should display the question and answers', () => {
      // Start the quiz
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Check the first question content
      cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
      
      // Check the answer options
      cy.get('.alert.alert-secondary').eq(0).should('contain', '6');
      cy.get('.alert.alert-secondary').eq(1).should('contain', '8');
      cy.get('.alert.alert-secondary').eq(2).should('contain', '9');
      cy.get('.alert.alert-secondary').eq(3).should('contain', '12');
    });
  
    it('should complete a full quiz and show the correct score', () => {
      // Start the quiz
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
      
      // Answer all questions (3 in our mock data)
      // First question: select the correct answer (option 2)
      cy.get('.btn.btn-primary').eq(1).click();
      
      // Second question: select the correct answer (option 3)
      cy.get('.btn.btn-primary').eq(2).click();
      
      // Third question: select the correct answer (option 3)
      cy.get('.btn.btn-primary').eq(2).click();
      
      // Verify quiz completion and score
      cy.get('h2').should('contain', 'Quiz Completed');
      cy.get('.alert.alert-success').should('contain', 'Your score: 3/3');
    });
  
    it('should allow starting a new quiz after completion', () => {
      // Start and complete a quiz
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
      
      cy.get('.btn.btn-primary').eq(1).click();
      cy.get('.btn.btn-primary').eq(2).click();
      cy.get('.btn.btn-primary').eq(2).click();
      
      // Start a new quiz
      cy.get('button').contains('Take New Quiz').click();
      cy.wait('@getQuestions');
      
      // Verify we're back at the first question
      cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
    });
  
    it('should show progress by advancing through questions', () => {
      // Start the quiz
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
      
      // First question
      cy.get('h2').should('contain', 'What is the output of print(2 ** 3)?');
      cy.get('.btn.btn-primary').eq(0).click(); // Select an answer (doesn't matter which)
      
      // Second question
      cy.get('h2').should('contain', 'Which of the following is a mutable data type in Python?');
      cy.get('.btn.btn-primary').eq(0).click(); // Select an answer
      
      // Third question
      cy.get('h2').should('contain', 'What is the keyword used to define a function in Python?');
    });
  });