import { FaUser } from "react-icons/fa";
import { useThread } from "../contexts/ThreadContext";


type ThreadProps = {
  thread: Thread | QNAThread;
  onClick?: () => void;
};

export default function ThreadPreview({ thread, onClick }: ThreadProps) {
  const { comments } = useThread();

  const threadComments = comments.filter(
    (c) => (c as { thread: number }).thread === thread.id
  );

  const answerCount = threadComments.length;

  if (onClick) {
    return (
      <div onClick={onClick}>
        <div className="items-center mt-2 bg-blue-950 text-gray-200 rounded-xl p-5 cursor-pointer">
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="font-semibold">{thread.creator.userName}</p>
          </div>
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