import { useUser } from "../contexts/UserContext"

function LogOutButton() {

    const { currentUser, actions } = useUser()

    // Function to handle logout when button is clicked
    const handleLogOut: React.MouseEventHandler<HTMLButtonElement> = () => {
        actions.setUser(null)
        return
    }

    return (
        <>{/* Only show the button if a user is currently logged in */}
            {currentUser !== null &&
                <button className="rounded-lg py-1 px-2 border-white border-2 text-white text-sm hover:bg-orange-400" onClick={handleLogOut}>
                    Logga ut
                </button>
            }
        </>
    )
}
export default LogOutButton