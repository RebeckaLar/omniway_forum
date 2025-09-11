import { FaUser } from "react-icons/fa"
import { useThread } from "../contexts/ThreadContext";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import CommentForm from "./CommentForm";

type CommentProps = {
  comment: ForumComment;
  threadCategory: ThreadCategory;
  threadId: number;
  allComments: ForumComment[];
}

function Comment({ comment, threadCategory, threadId, allComments }: CommentProps) {
  const { actions, threads } = useThread()
  const { currentUser } = useUser()

  // State for login prompt if the user is not logged in
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false)
  // State for reply to comments
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Check if the thread is a QNA thread
  function isQNAThread(thread: ThreadCategoryType): thread is QNAThread {
    return thread.category == "QNA";
  }

  const currentThread = threads.find((t) => t.id === threadId)

  const QNAThreads = threads
    .filter((item): item is QNAThread => isQNAThread(item))

  const _thread = QNAThreads.find(
    (t) => t.id === threadId
  );


  // Explicit words
  const bannedWords = ["Bitch", "Bastard", "Bloody", "Bollocks"]

  function censorText(text: string) {
    let censored = text;
    bannedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      censored = censored.replace(regex, "***");
    });
    return censored;
  }

  // Check if the current user is the creator of the thread
  const isThreadCreator = currentUser?.userName === _thread?.creator.userName;

  // Function to reply to another comment
  const replies = allComments.filter(c => c.comment === comment.id);

  // Function to mark a comment as the answer in a QNA thread
  const handleToggleIsAnswered = () => {
    if (!currentUser) {
      setShowLoginPopup(true)
      return;
    }

    if (!_thread) return;

    const canMarkAnswer = isThreadCreator || currentUser?.isModerator;
    if (!canMarkAnswer) return;

    const isCurrentlyAnswer = _thread.isAnswered && _thread.commentAnswerId === comment.id;

    const updatedThread: QNAThread = {
      id: _thread.id,
      title: _thread.title,
      category: "QNA",
      creationDate: _thread.creationDate,
      description: _thread.description,
      creator: _thread.creator,
      commentsLocked: _thread.commentsLocked,
      isAnswered: isCurrentlyAnswer ? false : true,
      commentAnswerId: isCurrentlyAnswer ? undefined : comment.id
    }

    const threadIndex = threads.findIndex((t) => t.id === threadId);
    actions.updateQNAThread(threadIndex, updatedThread)
  }

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  if (!comment.creator) {
    return <p className="text-white">Kommentar saknar skapare</p>
  }

  return (
    <div className='p-4 mt-4 rounded-lg mb-4 border border-gray-300 bg-blue-950'>
      {/* Comment header */}
      <div className='flex gap-2 items-center'>
        <div className='text-gray-200'><FaUser /></div>
        <p className='font-semibold text-gray-200'>{comment.creator.userName}</p>
      </div>

      {/* Comment content */}
      <p className='text-gray-200 my-3'>{censorText(comment.content)}</p>

      {/* Reply button */}
      {currentUser && !currentThread?.commentsLocked && (
        <button
          className="bg-orange-600 px-2 py-1 rounded text-white me-2"
          onClick={() => setShowReplyForm(!showReplyForm)}>
          {showReplyForm ? "Avbryt" : "Svara"}
        </button>
      )}

      {/* Reply form */}
      {showReplyForm && currentUser && currentThread && !currentThread.commentsLocked && (
        <CommentForm
          thread={currentThread}
          parentComment={comment}
          onClose={() => setShowReplyForm(false)} />
      )}

      {/* QNA: mark as answer */}
      {threadCategory === "QNA" && (
        ((_thread?.commentAnswerId === comment.id) || (isThreadCreator || currentUser?.isModerator)) && (
          <button
            onClick={handleToggleIsAnswered}
            disabled={!(isThreadCreator || currentUser?.isModerator)}
            className={`bg-green-900 text-white text-sm rounded p-2 cursor-pointer
            ${_thread?.commentAnswerId == comment.id ? 'bg-green-900' : 'bg-neutral-500'}
            ${!(isThreadCreator || currentUser?.isModerator) ? 'cursor-default' : ''}`}
          >
            {_thread?.commentAnswerId == comment.id ? 'Svar' : 'Markera som svar'}
          </button>
        )
      )}

      {/* Render a list of replies if there are any */}
      {replies.length > 0 && replies.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          threadCategory={threadCategory}
          threadId={threadId}
          allComments={allComments} />
      ))}

      {/* Show login popup when user tries reply without being logged in */}
      {showLoginPopup && (
        <div onClick={closeLoginPopup} className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center'>
          <div className="bg-white text-black p-6 rounded shadow-lg text-center max-w-sm w-full">
            <p className="mb-4 text-lg font-semibold">Du måste vara inloggad för att markera en kommentar som svar.</p>
            <button
              onClick={closeLoginPopup}
              className="mt-2 px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-700"
            >
              Stäng
            </button>
          </div>
        </div>
      )
      }

    </div>
  )
}
export default Comment