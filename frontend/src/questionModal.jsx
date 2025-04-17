import QuestionForm from './questionForm';

function CreateQuestionModal({ close, create, gameId }) {

  const handleSubmit = (newQuestion) => {
    console.log(newQuestion.duration)
    create(newQuestion);
  }

  return (
    <div className="modal-container">
      <div className="modal-header">
        <h4 className="modal-title">Create a new game</h4>
      </div>
      <div className="modal-body">
        <QuestionForm mode="create" gameId={gameId} onSubmit={handleSubmit} close={close} />
      </div>
    </div>
  );
}

export default CreateQuestionModal;