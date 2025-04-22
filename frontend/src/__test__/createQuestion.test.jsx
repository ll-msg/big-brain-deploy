import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it} from "vitest";
import CreateQuestionModal from '../questionModal';

describe("create a new question test", () => {
    let onCreate;
    let onClose;
    
    // basic outline for question form
    beforeEach(() => {
        onCreate = vi.fn();
        onClose = vi.fn();
    
        render(
          <CreateQuestionModal
            gameId={123}
            create={onCreate}
            close={onClose}
          />
        );
    });

    // render modal with all question fields
    it('renders modal title and basic fields', () => {
        expect(screen.getByText(/Create a new question/i)).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Enter question')).toBeInTheDocument();

        expect(screen.getByDisplayValue('Single Choice')).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Specify time limit')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Specify time limit')).toHaveValue(30); 

        expect(screen.getByPlaceholderText('Points')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Points')).toHaveValue(100);

        expect(screen.getByPlaceholderText('https://www.youtube.com/...')).toBeInTheDocument();
        expect(screen.getByLabelText(/Attach Question Image/i)).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Answer 1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Answer 2')).toBeInTheDocument();
        expect(screen.getByText('Add Possible Answer')).toBeInTheDocument();

        expect(screen.getByText('Create')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    // give question input and submit
    it ('types into question input and submit', () => {
        fireEvent.change(screen.getByPlaceholderText('Enter question'), {
            target: { value: 'What is 1 + 4?' },
        });

        fireEvent.change(screen.getByPlaceholderText('Specify time limit'), {
            target: { value: 30 },
        });

        fireEvent.change(screen.getByPlaceholderText('Points'), {
            target: { value: 100 },
        });

        fireEvent.change(screen.getByPlaceholderText('https://www.youtube.com/...'), {
            target: { value: 'https://www.youtube.com/watch?v=jfKfPfyJRdk&themeRefresh=1' },
        });

        const file = new File(['image content'], 'test-image.png', { type: 'image/png' });
        const imageInput = screen.getByLabelText(/Attach Question Image/i);
        fireEvent.change(imageInput, { target: { files: [file] } });
        
        const answerInputs = screen.getAllByPlaceholderText(/Answer/);
        fireEvent.change(answerInputs[0], { target: { value: '5' } });
        fireEvent.change(answerInputs[1], { target: { value: '6' } });

        fireEvent.click(screen.getByText('Create'));
        expect(onCreate).not.toHaveBeenCalled();

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        fireEvent.click(screen.getByText('Create'));
        expect(onCreate).toHaveBeenCalled(); 
    })

    // add a possible answer and delete it 
    it ('adds a new answer and deletes it', () => {
        fireEvent.click(screen.getByText('Add Possible Answer'));
        expect(screen.getAllByPlaceholderText(/Answer/).length).toBe(3);

        const deleteButtons = screen.getAllByText('Delete Answer');
        fireEvent.click(deleteButtons[2]);
        expect(screen.getAllByPlaceholderText(/Answer/).length).toBe(2);
    })

    // judgement question pre-defined answer
    it ('has fixed answer true/false when switching to judgement question', () => {
        fireEvent.change(screen.getByDisplayValue('Single Choice'), {
            target: { value: 'judgement' },
        });
        const answers = screen.getAllByPlaceholderText(/Answer/);
            expect(answers[0]).toHaveValue('True');
            expect(answers[1]).toHaveValue('False');
    });

    // cancel creating question
    it('closes when Cancel is clicked', () => {
        fireEvent.click(screen.getByText('Cancel'));
        expect(onClose).toHaveBeenCalled();
    });

    // cannot create question when any required field is missing
    it ('does not submit when required fields are missing', () => {
        fireEvent.click(screen.getByText('Create'));
        expect(onCreate).not.toHaveBeenCalled();
    }) 

});