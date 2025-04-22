import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi} from "vitest";
import Navbar from '../navbar';
import { MemoryRouter } from 'react-router-dom';

// mock navigate
const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});


describe('navbar component', () => {
  // make sure starts from not logged in
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // show bigbrain title
  it('renders title', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/BigBrain/i)).toBeInTheDocument();
  });

  // not logged in - has 3 navigations
  it('shows login/register/join game if not logged in', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Join Game/i)).toBeInTheDocument();
  });

  // logged in - has 3 new navigations
  it('shows logout if logged in', () => {
    sessionStorage.setItem('token', 'fake-token');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Join Game/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
  });

});

