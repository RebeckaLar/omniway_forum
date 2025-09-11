import { useUser } from "../contexts/UserContext"

function LogOutButton() {

    const { currentUser, actions } = useUser()

    const handleLogOut: React.MouseEventHandler<HTMLButtonElement> = () => {
        actions.setUser(null)
        // alert(`Användare ${currentUser?.userName} loggade ut`)
        return
    }

    return (
        <>
            {currentUser !== null &&
                <button className="rounded-lg py-1 px-2 border-white border-2 text-white text-sm hover:bg-orange-400" onClick={handleLogOut}>
                    Logga ut
                </button>
            }
        </>
    )
}
export default LogOutButton