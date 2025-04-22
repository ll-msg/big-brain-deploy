/* eslint-env cypress */
import 'cypress-file-upload';

describe('Admin Happy Path', () => {
  const testTime = Date.now();
  const email = `test_${testTime}@test.com`;
  const password = '12345';

  it('registers, creates, starts, ends game, loads result, logs out & logs back', () => {
    // 1. Register admin
    window.cy.visit('http://localhost:3000/register');
    window.cy.get('input[name="name"]').type('Admin');
    window.cy.get('input[name="email"]').type(email);
    window.cy.get('input[name="password"]').type(password);
    window.cy.get('input[name="confirmPassword"]').type(password);
    window.cy.get('button').contains('Sign Up').click();

    // login after regiser
    window.cy.url().should('include', '/login');
    window.cy.get('input[name="email"]').type(email);
    window.cy.get('input[name="password"]').type(password);
    window.cy.get('button').contains('Login').click();
    window.cy.url().should('include', '/dashboard');
  
    // 2. Create new game
    window.cy.contains('Create a new game').click();
    window.cy.wait(1000);
    window.cy.get('input[placeholder="Enter game name"]').type('Test Game');
    window.cy.get('input[type="file"]').attachFile('Random_Turtle.jpg');
    window.cy.get('button[name="create-game"]').click();
    window.cy.contains('Test Game').should('exist');
      
    // 3. Edit game name or thumbnail
    window.cy.contains('Edit').click();
    window.cy.get('input[placeholder="Enter game name"]').clear().type('Updated Game');
    window.cy.get('button').contains('Save').click();
  
    // create question
    window.cy.contains('.game-card', 'Updated Game').within(() => {
      window.cy.contains('Questions').click();
    });
    window.cy.get('button').contains('Create a new question').click();

    window.cy.get('input[placeholder="Enter question"]').type('What is 2 + 2?');
    window.cy.get('select#question-type').select('single choice');
    window.cy.get('input[placeholder="Specify time limit"]').clear().type('15');
    window.cy.get('input[placeholder="Points"]').clear().type('50');

    window.cy.get('input[placeholder="Answer 1"]').type('4');
    window.cy.get('input[placeholder="Answer 2"]').type('5');
    window.cy.get('input[type="checkbox"]').first().check();

    window.cy.get('button[name="create-question"]').click();

    window.cy.contains('Q1: What is 2 + 2?').should('exist');

    // 4. Start game
    window.cy.visit('http://localhost:3000/dashboard');
    window.cy.contains('Start Game').click();
    window.cy.contains('Session ID:').should('exist');

    window.cy.get('[data-testid="session-id"]').invoke('text').then((text) => {
      window.cy.wrap(text.trim()).as('sessionId');
    });
      

    // Create question
    window.cy.contains('Close').click();
    window.cy.get('.modal').should('not.exist');

    window.cy.get('@sessionId').then((sessionId) => {
      // Player join game
      window.cy.origin('http://localhost:3001', { args: { sessionId } }, ({ sessionId }) => {
        window.cy.visit(`/session/join?sessionId=${sessionId}`);
        window.cy.get('input[placeholder="Enter your name"]').type('Player1');
        window.cy.get('button[name="join-game"]').click();
        window.cy.url().should('include', `session/play/${sessionId}`);
        window.cy.contains('Please wait for the game to start...').should('exist');
      });
      
      // Admin advance to next question
      window.cy.visit(`http://localhost:3000/session/${sessionId}`);
      window.cy.contains('Advance').click();
      
      // Player answer question
      window.cy.origin('http://localhost:3001', { args: { sessionId } }, ({ sessionId }) => {
        window.cy.visit(`session/play/${sessionId}`);
        window.cy.contains('What is 2 + 2?').should('exist');
        window.cy.contains('4').click();
        window.cy.wait(1000);
      });
      
      // Admin stop game and get results
      window.cy.visit(`http://localhost:3000/session/${sessionId}`);
      window.cy.wait(3000);
      window.cy.contains('Stop Session').click();
      
      window.cy.url().should('include', `/session/${sessionId}/result`);
      window.cy.contains('Player Scores').should('exist');
      window.cy.contains('Correctness Rate per Question').should('exist');
      window.cy.contains('Average Answer Time per Question').should('exist');
    });

    window.cy.wait(1000)
      
  
    // 8. Logout
    window.cy.contains('Logout').click();
    window.cy.url().should('include', '/login');

    window.cy.wait(1000)
  
    // 9. Login again
    window.cy.get('input[name="email"]').type(email);
    window.cy.get('input[name="password"]').type(password);
    window.cy.get('button').contains('Login').click();
    window.cy.url().should('include', '/dashboard');
  });
});
  