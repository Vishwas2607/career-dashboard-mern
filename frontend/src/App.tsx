import { Routes,Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useState } from 'react'
import { AnimatePresence , motion} from 'framer-motion'
import { Squash as Hamburger } from 'hamburger-react'
import { ThemeBtn } from './components/ThemeButton'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Home from './pages/home'
import { Dashboard } from './pages/dashboard'
import Applications from './pages/applications'
import AddApplication from './pages/addApplication'
import ProtectedRoute from './layouts/protectedRoute'
import JobDetails from './pages/jobDetails'
import ProfilePage from './pages/profile'
import PageNotFound from './pages/404Page'

function App() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const closeSidebar = () => {
    setOpen(false);
  };


  return (
    <>
    <div className='flex flex-col min-h-svh w-full'>
          <header className=' flex justify-between items-center md:px-2 bg-blue-500 dark:bg-blue-950 transition-all duration-500 ease-in-out'>
          <div className='lg:hidden'>
          <Hamburger toggled={isOpen} toggle={()=> setOpen(true)} color='white' size={20}></Hamburger>
          </div>
          <h1 className='text-xl md:text-3xl font-bold text-white dark:text-white/80 transition-all duration-500 ease-in-out'>Career Dashboard</h1>
          <div className='flex gap-5 justify-center items-center mr-1'><Navbar></Navbar>
          <ThemeBtn/>
          </div>
          <AnimatePresence>
          {isOpen && (<motion.div 
          key="sidebar"
          initial = {{x: "-100%"}}
          animate= {{x: 0}}
          exit={{x: "-100%"}}
          transition={{duration:0.5}}
          aria-hidden= {!isOpen}
          className='lg:hidden z-10 fixed w-40 h-full bg-blue-400 top-0 left-0 dark:bg-blue-900 transition-colors duration-500 ease-in-out ' 
          >{<Sidebar closeSidebar={closeSidebar}></Sidebar>}</motion.div>
        )}
          </AnimatePresence>
        </header>

      <main className="bg-blue-200 flex-1 dark:bg-gray-900 transition-all duration-500 ease-in-out flex flex-col max-w-svw items-center pb-10">
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/applications' element={<Applications/>}></Route>
          <Route path='/addapplication' element={<AddApplication/>}></Route>
          <Route path='/editapplication/:jobId' element={<AddApplication/>}></Route>
          <Route path="/jobdetails/:jobId" element={<JobDetails/>}/>
          <Route path="/profiledetails" element={<ProfilePage/>}/>
        </Route>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      </main>

      <footer className='text-sm w-full md:text-lg flex justify-center items-center text-center px-4 bg-blue-500 dark:bg-blue-950 transition-all duration-500 ease-in-out text-white dark:text-white/85 p-1'>
        <p>Built with the MERN stack for Career Success © {new Date().getFullYear()}.</p>
      </footer>
    </div>
    </>
  )
}

export default App
