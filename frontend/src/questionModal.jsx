import QuestionForm from './questionForm';

function CreateQuestionModal({ close, create, gameId, game}) {

  const handleSubmit = (newQuestion) => {
    create(newQuestion);
  }

  return (
    <div className="modal-container">
      <div className="modal-body">
        <QuestionForm mode="create" gameId={gameId} game={game} onSubmit={handleSubmit} close={close} />
      </div>
    </div>
  );
}

export default CreateQuestionModal;