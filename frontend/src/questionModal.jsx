import QuestionForm from './questionForm';

function CreateQuestionModal({ close, create, gameId }) {

  const handleSubmit = (newQuestion) => {
    create(newQuestion);
  }

  return (
    <div className="modal-container">
      <div className="modal-body">
        <QuestionForm mode="create" gameId={gameId} onSubmit={handleSubmit} close={close} />
      </div>
    </div>
  );
}

export default CreateQuestionModal;