import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, Container, TextField } from '@mui/material'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { submitUserData } from "../services/user-service";
import ApiSnackBar from "../components/api-snackbar";
import { Link, useNavigate } from "react-router-dom";



export const Signup: React.FC = function () {
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false)
    const [snackbarMessage,setSnackBarMessage] = useState<string>('')
    const navigate = useNavigate();
    const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(6),
        confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Password must match ').required()
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const mutation = useMutation({
        mutationKey: ['create_user'],
        mutationFn: submitUserData,
        onSuccess: () => {
            navigate('/')
        },
        onError: (error) => {
            setOpenSnackBar(true);
           setSnackBarMessage(error.message)
        },
    })
    const submitUser = function (userData: any): void {
        mutation.mutate(userData);

    }
    const handleClose = () => {
        setOpenSnackBar(false)
    }

    return <Container>
        <Card className="">
            <CardHeader className="text-center" title='Signup'>

            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(submitUser)} className="flex flex-col items-center gap-4" action="
                ">
                    <div >
                        <TextField error={!!errors.name} helperText={errors.name?.message}   {...register('name')} className="w-100" label="name"></TextField>
                    </div>
                    <div >
                        <TextField error={!!errors.email} helperText={errors.email?.message} {...register('email')} className="w-100" label="email"></TextField>
                    </div>
                    <div >
                        <TextField error={!!errors.password} helperText={errors.password?.message}   {...register('password')} className="w-100" label="password"></TextField>
                    </div  >
                    <div >
                        <TextField error={!!errors.confirmPassword?.message} helperText={errors.confirmPassword?.message}   {...register('confirmPassword')} className="w-100" label="repeat password"></TextField>
                    </div>
                    <div>
                        <Button loading={mutation.isPending} className="w-100" type="submit" variant="contained" loadingPosition="end">
                            Submit
                        </Button>
                    </div>
                    <div>Already have an account?  <Link to={'/'} className="text-sky-700"> Click here to Login</Link> </div>
                </form>

            </CardContent>
        </Card>
        <ApiSnackBar open={openSnackBar}
            handleClose={handleClose}
            severity={mutation.isError ? 'error' : 'success'}
            message={mutation.isSuccess ? 'User created Successfully' : snackbarMessage} />

    </Container>
}