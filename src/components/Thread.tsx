import { FaEdit, FaUser } from 'react-icons/fa';
import CommentForm from './CommentForm';
import { useEffect, useState } from 'react';
import CommentsList from './CommentsList';
import { useThread } from '../contexts/ThreadContext';
import { useUser } from '../contexts/UserContext';

type ThreadProps = {
  thread: Thread | QNAThread;
};

export default function Thread({ thread }: ThreadProps) {
  const { threads, comments, actions } = useThread();
  const { currentUser } = useUser();
  // Get the most up-to-date thread from state, fallback to prop
  const currentThread = threads.find(t => t.id === thread.id) || thread;

  const [showCommentForm, setShowCommentForm] = useState<boolean>(false)
  const [commentsLocked, setCommentsLocked] = useState<boolean | undefined>(thread.commentsLocked)

  // Local state to handle thread editing
  const [isEditing, setIsEditing] = useState(false)
  const [editedThread, setEditedThread] = useState({
    title: thread.title ?? '',
    description: thread.description ?? ''
  })

  // Reset editedThread if editing mode is turned off or thread props change
  useEffect(() => {
    if (!isEditing) {
      setEditedThread({
        title: thread.title ?? '',
        description: thread.description ?? '',
      })
    }
  }, [thread.title, thread.description, isEditing])

  // Permissions: who can edit or lock comments
  const canEdit = currentUser?.userName === thread.creator.userName || currentUser?.isModerator;
  const canLock = currentUser?.userName === thread.creator.userName || currentUser?.isModerator;

  // Filter all comments for thread
  const threadComments = comments?.filter(c => c.thread === thread.id);
  const answerCount = threadComments.length;

  // Toggle comments lock state both locally and in global context
  const toggleCommentsLock = (threadId: number) => {
    actions.toggleCommentsLock(threadId);
    setCommentsLocked((prev) => !prev);
  }

  // Save the edited thread details to global state
  const handleSaveEdit = () => {
    actions.updateThread(thread.id, {
      title: editedThread.title,
      description: editedThread.description
    })
    setIsEditing(false)
  }

  // Cancel editing and reset local editedThread state
  const handleCancelEdit = () => {
    setEditedThread({
      title: thread.title,
      description: thread.description,
    })
    setIsEditing(false)
  }

  return (
    <div className='p-4 rounded-lg mb-4 border-gray-300 bg-blue-950'>
      {/* Header */}
      <div className='flex justify-between mb-4'>
        <div className='flex gap-2 items-center'>
          <div className='text-gray-200'><FaUser /></div>
          <p className='font-semibold text-gray-200 flex gap-2'>
            {thread.creator.userName}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-200'>{thread.category}</p>
        </div>
      </div>

      {/* Title row with optional Edit button */}
      <div className='flex items-center justify-between'>
        {!isEditing ? (
          <>
            <h3 className='text-gray-200 text-xl font-semibold'>{currentThread.title}</h3>
            <div className="flex gap-3">
              {canEdit && (
                <button
                  className='text-gray-200 hover:text-gray-300 font-semibold text-sm flex items-center gap-1'
                  onClick={() => setIsEditing(true)}>
                  <FaEdit />Edit
                </button>
              )}
              <p className='text-gray-200 text-sm'>{thread.creationDate}</p>
            </div>
          </>
        ) : (
          <input
            className='w-full p-2 rounded mb-2'
            value={editedThread.title}
            onChange={(e) => setEditedThread({ ...editedThread, title: e.target.value })} />
        )}
      </div>

      {/* Description */}
      {!isEditing ? (
        <p className='text-gray-200 my-3'>{currentThread.description}</p>
      ) : (
        <textarea
          className='w-full h-32 p-2 rounded mb-2'
          value={editedThread.description}
          onChange={(e) => setEditedThread({ ...editedThread, description: e.target.value })} />
      )}

      {/* Save/Cancel only visible in edit mode */}
      {isEditing && (
        <div className="flex gap-2 mb-3">
          <button
            className="bg-green-700 px-2 py-1 rounded text-white"
            onClick={handleSaveEdit}>
            Save
          </button>
          <button
            className="bg-red-700 px-2 py-1 rounded text-white"
            onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      )}

      {/* Answer count */}
      <p className='text-gray-200 italic text-sm mb-2'>
        {answerCount > 0 ? `${answerCount} answer${answerCount > 1 ? "s" : ""}` : "No answers yet"}
      </p>

      {/* Reply button */}
      {!commentsLocked && !isEditing && (
        <button className='bg-orange-600 text-gray-100 rounded px-3 py-2 text-sm hover:bg-orange-500'
          onClick={() => setShowCommentForm(true)}>
          Svara
        </button>
      )}

      {showCommentForm && !commentsLocked && (
        <CommentForm thread={thread} onClose={() => setShowCommentForm(false)} />
      )}

      {commentsLocked && <p className="text-orange-600 font-semibold mt-3">Kommentarer är låsta för denna tråd.</p>}

      {/* Lock/unlock only for creator */}
      {!isEditing && canLock && (
        <div className="mt-3">
          <button
            className='bg-orange-600 text-gray-100 rounded px-3 py-2 text-sm hover:bg-orange-500'
            onClick={() => toggleCommentsLock(thread.id)}>
            {commentsLocked ? 'Lås upp kommentarer' : 'Lås kommentarer'}</button>
        </div>
      )}

      <CommentsList
        threadId={thread.id}
        threadCategory={thread.category}
        comments={comments} />
    </div>
  );
}