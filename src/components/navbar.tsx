
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useMutation } from '@tanstack/react-query';
import { userLogout } from '../services/user-service';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearUser } from '../features/userSlice';

export default function Navbar() {

    const navigate = useNavigate()
    const user = useSelector((state:RootState)=>state.user)
    const dispatch = useDispatch()
    const logoutMutation = useMutation({
        mutationKey:['userLogut'],
        mutationFn:userLogout,
        onSuccess:()=>{
            dispatch(clearUser())
            sessionStorage.clear();
            navigate('/')
        }
      })
    const handleLogout = ()=>{
        logoutMutation.mutate()
     }
  return (
    <Box  sx={{ flexGrow: 1 }} >
      <AppBar position="static"   >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
         
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Your Weather Dashboard 
          </Typography>
          <span className='text-center'> Hi, {user.name}</span>
          <div >

            <Button color="inherit" onClick={handleLogout} >Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}