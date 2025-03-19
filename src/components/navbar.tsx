
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useMutation } from '@tanstack/react-query';
import { userLogout } from '../services/user-service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function Navbar() {

    const navigate = useNavigate()
    const user = useSelector((state:RootState)=>state.user)
    const logoutMutation = useMutation({
        mutationKey:['userLogut'],
        mutationFn:userLogout,
        onSuccess:()=>{
          sessionStorage.clear();
          navigate('/')
        },
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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hi, {user.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout} >Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}