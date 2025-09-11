import { FaUser } from "react-icons/fa";
import { useThread } from "../contexts/ThreadContext";


type ThreadProps = {
  thread: Thread | QNAThread;
  onClick?: () => void;
};

// Component to display a single thread preview card
export default function ThreadPreview({ thread, onClick }: ThreadProps) {

  // Get all comments from the global thread context
  const { comments } = useThread();

  // Filter comments that belong to this thread
  const threadComments = comments.filter(
    (c) => (c as { thread: number }).thread === thread.id
  );

  // Count the number of comments (answers) for this thread
  const answerCount = threadComments.length;

  // Only render if an onClick function is provided
  if (onClick) {
    return (
      <div onClick={onClick}>
        {/* Thread card container */}
        <div className="items-center mt-2 bg-blue-950 text-gray-200 rounded-xl p-5 cursor-pointer">

          {/* Thread creator info */}
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="font-semibold">{thread.creator.userName}</p>
          </div>

          {/* Thread title and answer count */}
          <div className="flex justify-between mt-2">
            <p className="text-xl">{thread.title}</p>
            <p className='text-gray-200 italic text-sm'> {answerCount > 0 ? `${answerCount} answer${answerCount > 1 ? "s" : ""}` : "No answers yet"}
            </p>
          </div>
        </div>
      </div>
    )
  }
}