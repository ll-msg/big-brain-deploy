import 'cypress-file-upload';

describe('Admin Happy Path', () => {
  const testTime = Date.now();
  const email = `test_${testTime}@test.com`;
  const password = '12345';

  it('registers, creates, starts, ends game, loads result, logs out & logs back', () => {
    // 1. Register admin
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="name"]').type('Admin');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('button').contains('Sign Up').click();

    // login after regiser
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button').contains('Login').click();
    cy.url().should('include', '/dashboard');
  
    // 2. Create new game
    cy.contains('Create a new game').click();
    cy.wait(1000);
    cy.get('input[placeholder="Enter game name"]').type('Test Game');
    cy.get('input[type="file"]').attachFile('Random_Turtle.jpg');
    cy.get('button[name="create-game"]').click();
    cy.contains('Test Game').should('exist');
      
    // 3. Edit game name or thumbnail
    cy.contains('Edit').click();
    cy.get('input[placeholder="Enter game name"]').clear().type('Updated Game');
    cy.get('button').contains('Save').click();
  
    // create question
    cy.contains('.game-card', 'Updated Game').within(() => {
      cy.contains('Questions').click();
    });
    cy.get('button').contains('Create a new question').click();

    cy.get('input[placeholder="Enter question"]').type('What is 2 + 2?');
    cy.get('select#question-type').select('single choice');
    cy.get('input[placeholder="Specify time limit"]').clear().type('15');
    cy.get('input[placeholder="Points"]').clear().type('50');

    cy.get('input[placeholder="Answer 1"]').type('4');
    cy.get('input[placeholder="Answer 2"]').type('5');
    cy.get('input[type="checkbox"]').first().check();

    cy.get('button[name="create-question"]').click();

    cy.contains('Q1: What is 2 + 2?').should('exist');

    // 4. Start game
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('Start Game').click();
    cy.contains('Session ID:').should('exist');

    cy.get('[data-testid="session-id"]').invoke('text').then((text) => {
      cy.wrap(text.trim()).as('sessionId');
    });
      

    // Create question
    cy.contains('Close').click();
    cy.get('.modal').should('not.exist');

    cy.get('@sessionId').then((sessionId) => {
      // Player join game
      cy.origin('http://localhost:3001', { args: { sessionId } }, ({ sessionId }) => {
        cy.visit(`/session/join?sessionId=${sessionId}`);
        cy.get('input[placeholder="Enter your name"]').type('Player1');
        cy.get('button[name="join-game"]').click();
        cy.url().should('include', `session/play/${sessionId}`);
        cy.contains('Please wait for the game to start...').should('exist');
      });
      
      // Admin advance to next question
      cy.visit(`http://localhost:3000/session/${sessionId}`);
      cy.contains('Advance').click();
      
      // Player answer question
      cy.origin('http://localhost:3001', { args: { sessionId } }, ({ sessionId }) => {
        cy.visit(`session/play/${sessionId}`);
        cy.contains('What is 2 + 2?').should('exist');
        cy.contains('4').click();
        cy.wait(1000);
      });
      
      // Admin stop game and get results
      cy.visit(`http://localhost:3000/session/${sessionId}`);
      cy.wait(3000);
      cy.contains('Stop Session').click();
      
      cy.url().should('include', `/session/${sessionId}/result`);
      cy.contains('Player Scores').should('exist');
      cy.contains('Correctness Rate per Question').should('exist');
      cy.contains('Average Answer Time per Question').should('exist');
    });

    cy.wait(1000)
      
  
    // 8. Logout
    cy.contains('Logout').click();
    cy.url().should('include', '/login');

    cy.wait(1000)
  
    // 9. Login again
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button').contains('Login').click();
    cy.url().should('include', '/dashboard');
  });
});
  