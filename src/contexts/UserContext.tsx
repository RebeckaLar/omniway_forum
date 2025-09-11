import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import LocalStorageService from "../utils/LocalStorageService"

type UserState = {
    users: User[]
    currentUser: User | null,
    actions: {
        createUser: (user: User) => void
        setUser: (user: User | null) => void
    }
}

const defaultState: UserState = {
    users: [],
    currentUser: null,
    actions: {
        createUser: () => {},
        setUser: () => {}
    }
}

const UserContext = createContext<UserState>(defaultState)

function UserProvider ({ children }: PropsWithChildren) {
    const [users, setUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(defaultState.currentUser)
    
    useEffect(() => {
      _getUsers()
      _getUser()
    }, [])
    
    const _getUsers = () => {
        const _users: User[] = LocalStorageService.getItem('@forum/users', [])
        setUsers(_users)
    }

    const _setUsers = (_users: User[]) => {
        LocalStorageService.setItem('@forum/users', _users)
        setUsers(_users)
    }

    const _getUser = () => {
        const _user: User | null = LocalStorageService.getItem('@forum/currentUser', defaultState.currentUser)
        setUser(_user)
    }

    const createUser: typeof defaultState.actions.createUser = (user) => {
        // console.log("User: ", user)

        const updatedUsers = [...users, user]
        _setUsers(updatedUsers)
    }

    const setUser = (user: User | null) => {
        LocalStorageService.setItem('@forum/currentUser', user)
        setCurrentUser(user)
    }

    const actions = {
        createUser,
        setUser
    }

    return (
        <UserContext.Provider value={{
            users,
            currentUser,
            actions
        }}>
            { children }
        </UserContext.Provider>
    )

}

function useUser() {
    const context = useContext(UserContext)
    if(context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export { UserProvider, useUser }