import { CgProfile } from "react-icons/cg";
import { SlBubbles } from "react-icons/sl";
import { BsQuestionCircleFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { MdLibraryBooks } from "react-icons/md";

import { useUser } from "../contexts/UserContext";
import LogOutButton from "./LogOutButton";
import { useState } from "react";
import Modal from 'react-modal'
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import kyhLogo from '../img/KYHlogo.png';
import { HiMenu, HiX } from "react-icons/hi";

function Header() {

  const { currentUser } = useUser()
  const [showLogin, setshowLogin] = useState<boolean>(false)
  const [showRegister, setshowRegister] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const NavItems = () => (
    <>
      <div className="flex flex-col items-center text-base gap-1">
        <MdLibraryBooks className="text-xl" />
        <p>Kurser</p>
      </div>

      <div className="flex flex-col items-center text-base gap-1">
        <IoMdMail className="text-xl" />
        <p>Inbox</p>
      </div>

      <div className="flex flex-col items-center text-base gap-1">
        <BsQuestionCircleFill className="text-xl" />
        <p>Hjälpcenter</p>
      </div>

      <div className="flex flex-col items-center text-base gap-1 font-bold">
        <SlBubbles className="text-xl" />
        <p>Forum</p>
      </div>

      <div className="flex flex-col items-center text-base gap-1 cursor-pointer" onClick={() => { if (!currentUser) setshowLogin(true) }}>
        <CgProfile className="text-xl" />
        <p>{currentUser == null ? 'Logga in' : currentUser.userName}</p>
      </div>

      <div className="flex flex-col items-center text-base gap-1 text-center justify-center">
        <LogOutButton />
      </div>
    </>
  )

  return (
    <header className="flex relative w-full bg-orange-500 h-16 mt-10">
      <div className="flex items-center justify-between px-3 md:p-0 md:justify-around w-full">

        <div className="realtive flex items-center z-50">
          <img src={kyhLogo} alt="KYH Logo" className="h-50 w-auto z-50 absolute shadow-md shadow-gray-700" />
        </div>

        <button className="md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>


        <nav className="hidden md:flex gap-6 text-white text-xl">
          <NavItems />
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden absolute top-full right-0 w-full rounded-b-lg bg-orange-500 text-white z-40">
          <div className="grid grid-cols-2 gap-6 h-auto mt-6 mb-4">
            <NavItems />
          </div>
        </nav>
      )}

      <Modal isOpen={showLogin}
        onRequestClose={() => setshowLogin(false)}
        className='bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20 realtive'
        overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50'>
        <button className="absolute top-2 right-2 text-gray-600">X</button>
        <LoginForm onSuccess={() => setshowLogin(false)} />
        <p className="text-sm my-4">Har du inget konto än? {''}
          <button className="text-blue-500 underline text-sm" onClick={() => { setshowLogin(false); setshowRegister(true) }}>Skapa konto här</button>
        </p>
      </Modal>

      <Modal isOpen={showRegister}
        onRequestClose={() => setshowRegister(false)}
        className='bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20 realtive'
        overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50'>
        <button className="absolute top-2 right-2 text-gray-600">X</button>
        <RegisterForm onSuccess={() => setshowRegister(false)} />
        <p className="text-sm my-4">Har du redan ett konto? {''}
          <button className="text-blue-500 underline text-sm" onClick={() => { setshowLogin(true); setshowRegister(false) }}>Logga in här</button>
        </p>

      </Modal>
    </header >
  )
}
export default Header