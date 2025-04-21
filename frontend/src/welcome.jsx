import controllerIcon from './assets/game-controller.gif'

function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-400 flex flex-col items-center justify-center px-4 py-10 text-center">
      <img
        src={controllerIcon}
        alt="game controller"
        className="w-28 h-28 mb-6 animate-bounce"
      />
      <h1 className="text-4xl font-extrabold text-blue-500 mb-2"> Welcome to BigBrain Game! </h1>
      <p className="text-lg text-gray-600"> Dive into the Ultimate Gaming Experience </p>
    </div>
  )
}

export default Welcome;