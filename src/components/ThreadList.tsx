import { useThread } from '../contexts/ThreadContext';
import { IoIosAddCircleOutline } from 'react-icons/io';
import ThreadPreview from './ThreadPreview';
import { useState } from 'react';
import Thread from './Thread';
import { FaArrowLeft } from 'react-icons/fa';
import Modal from 'react-modal'
import ThreadForm from './ThreadForm';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router';


export default function ThreadList() {
  const { threads } = useThread();
  const { currentUser } = useUser()
  const [selectedThread, setselectedThread] = useState<Thread | QNAThread | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleCreateThreadButton = () => {
    if (!currentUser) {
      setShowLoginPopup(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
    navigate('/');
  };

  if (selectedThread) {

    return (
      <div className='container mx-auto px-4 pt-20 lg:max-w-6xl'>
        <button onClick={() => setselectedThread(null)} className='flex gap-2 items-center mb-3'>
          <FaArrowLeft />
          <p>Tillbaka till forum</p>
        </button>
        <Thread thread={selectedThread} />
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 lg:max-w-6xl'>
      <h1 className='text-3xl text-center font-bold text-blue-950 mt-20'>Forum</h1>

      <div className='flex gap-2 items-center mb-4 text-2xl font-semibold cursor-pointer' onClick={handleCreateThreadButton}>
        <IoIosAddCircleOutline /><p>Skapa ny tråd</p>
      </div>

      {showLoginPopup && (
        <div onClick={closeLoginPopup} className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center'>
          <div className="bg-white text-black p-6 rounded shadow-lg text-center max-w-sm w-full">
            <p className="mb-4 text-lg font-semibold">Du måste vara inloggad för att skapa en tråd.</p>
            <button
              onClick={closeLoginPopup}
              className="mt-2 px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-700"
            >
              Stäng
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} appElement={document.getElementById('root') as HTMLElement} onRequestClose={() => setIsModalOpen(false)}
        contentLabel='Skapa ny tråd'
        className='text-blue-950 rounded'
        overlayClassName='fixed inset-0 text-white flex justify-center items-center z-50'>

        <ThreadForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="space-y-4">
        {
          threads.map((thread) => (
            <ThreadPreview
              key={thread.id}
              thread={thread}
              onClick={() => setselectedThread(thread)}
            />
          ))
        }
      </div >
    </div >
  )
}