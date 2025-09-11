import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import LocalStorageService from "../utils/LocalStorageService"

// Define a User type with id, username, password, and moderator status
type User = {
    id: number;
    userName: string;
    password: string;
    isModerator: boolean;
}

// Define the shape of the global user state
type UserState = {
    users: User[]
    currentUser: User | null,
    actions: {
        createUser: (user: User) => void
        setUser: (user: User | null) => void
    }
}

// Default state for UserContext
const defaultState: UserState = {
    users: [],
    currentUser: null,
    actions: {
        createUser: () => { },
        setUser: () => { }
    }
}

// Create a React context for user state
const UserContext = createContext<UserState>(defaultState)

// Provider component to wrap the app and provide user state
function UserProvider({ children }: PropsWithChildren) {
    const [users, setUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(defaultState.currentUser)

    // Load users and current user from local storage when provider mounts
    useEffect(() => {
        _getUsers()
        _getUser()
    }, [])

    // Fetch users from local storage
    const _getUsers = () => {
        const _users: User[] = LocalStorageService.getItem('@forum/users', [])
        setUsers(_users)
    }

    // Save users to local storage and update state
    const _setUsers = (_users: User[]) => {
        LocalStorageService.setItem('@forum/users', _users)
        setUsers(_users)
    }

    // Fetch current user from local storage
    const _getUser = () => {
        const _user: User | null = LocalStorageService.getItem('@forum/currentUser', defaultState.currentUser)
        setUser(_user)
    }

    // Action: Create a new user
    const createUser: typeof defaultState.actions.createUser = (user) => {
        const newUser = {
            ...user,
            isModerator: user.isModerator ?? false,
        }

        const updatedUsers = [...users, newUser]
        _setUsers(updatedUsers)
    }

    // Action: Set the current logged-in user
    const setUser = (user: User | null) => {
        LocalStorageService.setItem('@forum/currentUser', user)
        setCurrentUser(user)
    }

    // Collect actions to pass via context
    const actions = {
        createUser,
        setUser
    }

    // Provide users, currentUser, and actions to all children components
    return (
        <UserContext.Provider value={{
            users,
            currentUser,
            actions
        }}>
            {children}
        </UserContext.Provider>
    )

}

function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export { UserProvider, useUser }