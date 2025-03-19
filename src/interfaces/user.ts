
export interface createUser {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface loginUser {
    email: string,
    password: string
}
export interface ApiSnackBarProps {
    open: boolean;
    handleClose: () => void;
    severity: 'success' | 'error' | 'warning' | 'info';
    message: string;
}