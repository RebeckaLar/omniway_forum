import { useThread } from "../contexts/ThreadContext";
import Comment from "./Comment";

type CommentsListProps = {
  threadId: Thread['id'];
  threadCategory: Thread['category']
}

function CommentsList({ threadId, threadCategory }: CommentsListProps) {
  const { comments } = useThread();

  const threadComments = comments.filter(
    (c) => c.thread === threadId
  );

  return (
    <div className="container mx-auto px-4 lg:max-w-6xl mt-6">
     {
      threadComments.length > 0 && <h3 className="text-xl font-semibold text-white my-4">Alla kommentarer</h3>
     } 
      
      <div>
        {
          threadComments.map((c) => <Comment key={c.id} comment={c} threadCategory={threadCategory} threadId={threadId} />)
        }
      </div>
    </div>
  )
}
export default CommentsList