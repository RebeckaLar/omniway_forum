import { useForm } from 'react-hook-form';
import { useThread } from '../contexts/ThreadContext';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';

type CommentFormProps = {
  thread: Thread | QNAThread;
  parentComment?: ForumComment;
  onClose: () => void;
}

type FormData = {
  comment: string;
}

// Component for submitting a comment on a thread
function CommentForm({ thread, parentComment, onClose }: CommentFormProps) {
  const { actions } = useThread()
  const { currentUser } = useUser()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false)

  // Function called when the form is submitted
  const onSubmit = (data: FormData) => {
    if (!currentUser) {
      setShowLoginPopup(true)
      return;
    }

    // Create a new comment object
    const newComment: ForumComment = {
      id: Date.now(),
      thread: thread.id,
      content: data.comment,
      creator: currentUser as User,
      comment: parentComment?.id
    }

    actions.addComment(newComment);
    onClose();
  };

  // Function to close the login popup
  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  console.log(errors);
  return (
    <div onClick={onClose} className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center'>
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white max-w-screen-sm shadow-md rounded px-8 pt-6 pb-8 my-6 flex flex-col justify-center">

        {/* Close button */}
        <button
          onClick={onClose}
          className="hover:text-black shadow appearance-none border rounded font-semibold text-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline absolute right-2 top-2"
          aria-label="Stäng formulär"
        >
          X
        </button>

        {/* Info about which thread/comment this is replying to */}
        <div className="bg-white shadow-md rounded px-8 py-6 mt-10 mb-4">
          {thread && (
            <p>Svar till <span className='font-bold'>{thread.creator.userName}</span> på tråd <span className='font-bold'>{thread.title}</span></p>
          )}
        </div>

        {/* Comment form */}
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <textarea
              {...register("comment", {
                required: "Kommentaren får inte vara tom.",
                minLength: {
                  value: 2,
                  message: "Kommentaren måste vara minst 2 tecken."
                },
                maxLength: {
                  value: 300,
                  message: "Kommentaren får högst vara 300 tecken."
                }
              })}
              placeholder="Skriv din kommentar här..."
              className="w-full border rounded p-2"
            />

            {/* Display validation errors */}
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            Skicka Kommentar
          </button>
        </form>

        {/* Login popup if user is not logged in */}
        {showLoginPopup && (
          <div onClick={closeLoginPopup} className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center'>
            <div className="bg-white text-black p-6 rounded shadow-lg text-center max-w-sm w-full">
              <p className="mb-4 text-lg font-semibold">Du måste vara inloggad innan du lämnar en kommentar.</p>
              <button
                onClick={closeLoginPopup}
                className="mt-2 px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-700"
              >
                Stäng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CommentForm