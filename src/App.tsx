import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Signup } from './pages/signup'
import { Login } from './pages/login'
import { LandingPage } from './pages/home'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/store'
import { refreshToken } from './services/user-service'
import { setUser } from './features/userSlice'

function App() {
  const user = useSelector((state: RootState) => state.user);
  const userId: string | null = sessionStorage.getItem('userId')
  const dispatch = useDispatch()
  const { data: userData } = useQuery({
    queryKey: ['refresh_token'],
    queryFn: refreshToken,
    enabled: !user.access_token && !!userId,
  })
  if (userData) {
    dispatch(setUser(userData))
  }
  return (

    <Router>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<LandingPage />} />
      </Routes>
    </Router>

  )
}

export default App
