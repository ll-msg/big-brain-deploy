import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it} from "vitest";
import Modal from '../sessionModal';

// modal test - start game and have a modal containing session id 
describe("start session modal test", () => {
  const testId = '123456';
  
  beforeEach(() => {
    // mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it('renders modal with all the information', () => {
    render(
      <Modal onClose={vi.fn()}>
        <p>Game started</p>
        <p>Session ID:</p>
        <p data-testid="session-id">{testId}</p>
        <button onClick={() => navigator.clipboard.writeText(testId)} data-testid="copy-button">
          Copy Id
        </button>
        <button data-testid="close-session-button">Close</button>
      </Modal>
    );

      expect(screen.getByText('Game started')).toBeInTheDocument();
      expect(screen.getByText('Session ID:')).toBeInTheDocument();
      expect(screen.getByTestId('session-id')).toHaveTextContent(testId);
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
      expect(screen.getByTestId('close-session-button')).toBeInTheDocument();
  })

  it('copies sessionId when clicking the copy id button', () => {
    render(
      <Modal onClose={vi.fn()}>
        <p>Game started</p>
        <p>Session ID:</p>
        <p data-testid="session-id">{testId}</p>
        <button onClick={() => navigator.clipboard.writeText(testId)} data-testid="copy-button">
          Copy Id
        </button>
        <button data-testid="close-session-button">Close</button>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('copy-button'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testId);
  });

  it('closes modal when clicking the close button', () => {
    const onClose = vi.fn();

    render(
      <Modal onClose={onClose}>
        <p>Game started</p>
        <p>Session ID:</p>
        <p data-testid="session-id">{testId}</p>
        <button onClick={() => navigator.clipboard.writeText(testId)} data-testid="copy-button">
          Copy Id
        </button>
        <button onClick={onClose} data-testid="close-session-button">Close</button>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('close-session-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('happens nothing when background is clicked', () => {
    const onClose = vi.fn();

    render(
      <div data-testid="modal-overlay" onClick={onClose}>
        <div data-testid="modal-content" onClick={(e) => e.stopPropagation()}>
          <Modal onClose={onClose}>
            <p>Game started</p>
            <p>Session ID:</p>
            <p data-testid="session-id">{testId}</p>
            <button onClick={() => navigator.clipboard.writeText(testId)} data-testid="copy-button">
              Copy Id
            </button>
            <button onClick={onClose} data-testid="close-session-button">Close</button>
          </Modal>
        </div>
      </div>
    );

    fireEvent.click(screen.getByTestId('modal-content'));
    expect(onClose).not.toHaveBeenCalled();
  });

});