import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { ApiSnackBarProps } from "../interfaces/user";


const ApiSnackBar:React.FC<ApiSnackBarProps> = function ApiSnackBar({ open, handleClose, severity, message }) {

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default React.memo(ApiSnackBar)