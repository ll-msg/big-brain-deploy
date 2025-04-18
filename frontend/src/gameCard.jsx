import defaultImage from './assets/default-image.jpg';

function GameCard ({ game, goToQuestions, deleteGame, stopGame, startGame, editGame, navigate }) {

  const questionNum = game.questions?.length || 0;
  const thumbnail = game.thumbnail || defaultImage;
  const totalDuration = game.questions?.reduce((acc, q) => acc + (q.duration || 0), 0) || 0;
  const sessionId = localStorage.getItem(`game:${game.id}:sessionId`);

  return (
    <div className="game-card bg-neutral-900 text-white p-6 rounded-xl shadow-lg max-w-md w-full mx-auto mb-6 space-y-3 transition hover:scale-[1.02] hover:shadow-xl duration-200">
      <h3 className="text-2xl font-semibold">{game.name}</h3>
      <p 
        className="text-sm text-gray-300 underline cursor-pointer hover:text-white transition"
        onClick={() => goToQuestions(game.id)}
      >
        Questions: {questionNum}
      </p>
      <img src={thumbnail} alt="thumbnail" className="rounded-lg w-full h-40 object-cover border border-gray-700" />
      <p className="text-sm text-gray-400">Total Duration: {totalDuration}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <button onClick={() => editGame(game)} className="px-4 py-1 rounded bg-blue-500  hover:bg-blue-600 text-black text-sm">Edit</button>
        <button onClick={() => deleteGame(game.id)} className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-sm">Delete</button>
        {game.active ? (
          <button onClick={() => stopGame(game.id)} className="px-4 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-black text-sm">Stop Game</button>
        ) : (
          <button onClick={() => startGame(game.id)} className="px-4 py-1 rounded bg-green-500 hover:bg-green-600 text-black text-sm">Start Game</button>
        )}
        {game.active && <button onClick={() => navigate(`/session/${sessionId}`)} className="px-4 py-1 rounded border border-white text-sm hover:bg-white hover:text-black transition">Manage session</button>}
      </div>
      {game.active && <span className="active-visual">Active</span>}
    </div>
  );
};

export default GameCard;