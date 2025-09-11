import { useThread } from "../contexts/ThreadContext";
import Comment from "./Comment";

type CommentsListProps = {
  threadId: Thread['id'];
  threadCategory: Thread['category']
  comments: ForumComment[];
}

// Component to display all comments for a specific thread
function CommentsList({ threadId, threadCategory }: CommentsListProps) {
  const { comments } = useThread();

  // Filter comments that belong to this thread
  const threadComments = comments.filter(
    (c) => c.thread === threadId
  );

  // Filter only top-level comments (not replies to other comments)
  const topLevelComments = comments.filter(c => c.thread === threadId && !c.comment);

  return (
    <div className="container mx-auto px-4 lg:max-w-6xl mt-6">
      {/* Show heading only if there are comments */}
      {threadComments.length > 0 &&
        <h3 className="text-xl font-semibold text-white my-4">Alla kommentarer</h3>
      }

      <div>
        {/* Render each top-level comment */}
        {topLevelComments.map((c) =>
          <Comment
            key={c.id}
            comment={c}
            threadCategory={threadCategory}
            threadId={threadId}
            allComments={threadComments} />)}
      </div>
    </div>
  )
}
export default CommentsList