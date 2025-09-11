import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import LocalStorageService from "../utils/LocalStorageService";
import { dummyThreads } from "../data/threads";
import { dummyComments } from "../data/comments";

// Define the shape of the global thread state, including threads, comments, and actions
type ThreadState = {
  threads: ThreadCategoryType[];
  comments: ForumComment[];
  actions: {
    createThread: (thread: ThreadCategoryType) => void;
    updateQNAThread: (threadIndex: number, updatedThread: QNAThread) => void;
    updateThread: (threadId: number, updatedData: Partial<Thread>) => void;
    getThreadByID: (threadId: ThreadCategoryType['id']) => Thread | undefined;
    addComment: (comment: ForumComment) => void;
    isQNAAnswered: (threadId: ThreadCategoryType['id']) => boolean;
    toggleCommentsLock: (threadId: Thread['id']) => void;
  }
};

// Default state used when creating the context
const defaultState: ThreadState = {
  threads: [],
  comments: [],
  actions: {
    createThread: () => { },
    updateQNAThread: () => { },
    updateThread: () => { },
    getThreadByID: () => undefined,
    addComment: () => { },
    isQNAAnswered: () => false,
    toggleCommentsLock: () => { }
  }
};

// Create a React context to hold thread state globally
const ThreadContext = createContext<ThreadState>(defaultState);

// Provider component to wrap the app and provide thread state
function ThreadProvider({ children }: PropsWithChildren) {
  const [threads, setThreads] = useState<ThreadCategoryType[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);

  // Load threads and comments when the provider mounts
  useEffect(() => {
    _getThreads();
    getComments();
  }, [])

  // Fetch threads from local storage or dummy data
  const _getThreads = () => {
    const _threads: ThreadCategoryType[] = LocalStorageService.getItem('@forum/threads', dummyThreads);
    setThreads(_threads)
  }

  // Action: Add a new thread
  const createThread: typeof defaultState.actions.createThread = (thread) => {
    const newThreads = [...threads, thread]
    setThreads(newThreads)
    LocalStorageService.setItem<ThreadCategoryType[]>('@forum/threads', newThreads)
  }

  // Action: Update a QNA thread by index
  const updateQNAThread: typeof defaultState.actions.updateQNAThread = (threadIndex: number, updatedThread: QNAThread) => {
    const newThreads = [...threads]
    newThreads[threadIndex] = updatedThread
    setThreads(newThreads)
    LocalStorageService.setItem<ThreadCategoryType[]>('@forum/threads', newThreads)
  }

  // Action: Update a thread by ID with partial data
  const updateThread: typeof defaultState.actions.updateThread = (threadId, updatedData) => {
    const updatedThreads = threads.map((t) =>
      t.id === threadId ? { ...t, ...updatedData } : t
    )
    setThreads(updatedThreads)
    LocalStorageService.setItem('@forum/threads', updatedThreads)
  }

  // Action: Get a thread by its ID
  const getThreadByID: typeof defaultState.actions.getThreadByID = (threadId: number): Thread | undefined => {
    return threads.find(thread => thread.id === threadId)
  }

  // Action: Add a new comment
  const addComment: typeof defaultState.actions.addComment = (comment): void => {
    const newComments = [...comments, comment]
    setComments(newComments)
    LocalStorageService.setItem<ForumComment[]>('@forum/comments', newComments)

    setComments(newComments)
  }

  // Fetch comments from local storage or dummy data
  const getComments = () => {
    const _comments: ForumComment[] = LocalStorageService.getItem('@forum/comments', dummyComments)
    setComments(_comments)
  }

  // Action: Check if a QNA thread has been answered
  const isQNAAnswered: typeof defaultState.actions.isQNAAnswered = (threadId: number): boolean => {
    const thread = threads.find(t => t.id === threadId)

    if (thread && thread.category === "QNA") {
      const qnaThread = thread as QNAThread;
      return qnaThread.isAnswered;
    }

    return false;
  }

  // Action: Toggle whether comments are locked for a thread
  const toggleCommentsLock: typeof defaultState.actions.toggleCommentsLock = (threadId: number): void => {
    const updatedThreads = threads.map((thread) =>
      thread.id === threadId
        ? { ...thread, commentsLocked: !thread.commentsLocked }
        : thread
    );

    setThreads(updatedThreads);
    LocalStorageService.setItem('@forum/threads', updatedThreads);
  }

  // Collect all actions into a single object to pass via context
  const actions: typeof defaultState.actions = {
    createThread,
    updateQNAThread,
    updateThread,
    getThreadByID,
    addComment,
    isQNAAnswered,
    toggleCommentsLock
  }

  // Provide threads, comments, and actions to all children components
  return (
    <ThreadContext.Provider value={{
      threads,
      comments,
      actions
    }}>
      {children}
    </ThreadContext.Provider>
  )
}

// Custom hook to access thread context easily in components
function useThread() {
  const context = useContext(ThreadContext);
  return context;
}
export {
  ThreadProvider,
  useThread
}