import { Button, Card, CardContent, CardHeader, Container, TextField } from "@mui/material";
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { submitLogin } from "../services/user-service";
import { useMutation } from "@tanstack/react-query";
import ApiSnackBar from "../components/api-snackbar";
import { loginUser } from "../interfaces/user";
import { AppDispatch } from "../store/store";
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../features/userSlice";



export const Login: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const navigate = useNavigate()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false)
    const [snackbarMessage, setSnackBarMessage] = useState<string>('')
    const schema = yup.object().shape({
        email: yup.string().required().email(),
        password: yup.string().required()
    })
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const mutation = useMutation({
        mutationKey: ['login_user'],
        mutationFn: submitLogin,
        onSuccess: (data) => {
            dispatch(setUser(data));
            setOpenSnackBar(true);
            sessionStorage.setItem('userId', data.id)
            navigate('/home')

        },
        onError: (error) => {
            setSnackBarMessage(error.message)
            setOpenSnackBar(true)
        }
    })
    const handleClose = () => {
        setOpenSnackBar(false)
    }
    const submit = (userdata: loginUser) => {
        mutation.mutate(userdata)
    }
    return <Container>
        <Card>
            <CardHeader className="text-center" title='Login'></CardHeader>
            <CardContent>
                <form action="" className="flex flex-col items-center gap-4" onSubmit={handleSubmit(submit)}>
                    <div>
                        <TextField error={!!errors.email} helperText={errors.email?.message} className="w-100" label='Email'  {...register('email')} >

                        </TextField>
                    </div>
                    <div>
                        <TextField error={!!errors.password} helperText={errors.password?.message} className="w-100" label='Password' {...register('password')} >

                        </TextField>
                    </div>
                    <div>
                        <Button loading={mutation.isPending} className="w-100" type="submit" variant="contained" loadingPosition="end">Login</Button>

                    </div>
                    <span> Don't have an account?<Link to={'/signup'} className="text-sky-700" > Please sign up here</Link></span>
                    
                </form>
            </CardContent>
            <ApiSnackBar open={openSnackBar}
                handleClose={handleClose}
                message={mutation.isError ? snackbarMessage : 'User login successfully'}
                severity={mutation.isError ? 'error' : 'success'} />
        </Card>

    </Container>

}