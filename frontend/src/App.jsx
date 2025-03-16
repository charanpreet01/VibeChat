import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import Settings from "./pages/Settings"
import { useThemeStore } from "./store/useThemeStore"

function App() {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (

    <div data-theme={theme}>

      <BrowserRouter>

        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>

      </BrowserRouter>

      <Toaster
        position="top-right"
      />

    </div>

  )
}

export default App