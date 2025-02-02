import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { isLoginFormValid } from './validator';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from '@mui/material';

import LoginIcon from '../../assets/images/login.png';
import { FirebaseLoginErrorCode } from '../../common/firebase/error';
import {
  logInWithEmailAndPassword,
  sendPasswordReset,
} from '../../common/firebase/firebase';
import { isEmailValid, isFieldEmpty } from '../../common/validators';
import { updateLoading } from '../../store/reducers/userSlice';
import { useAppDispatch } from '../../store/store';

const containerStyles = {
  display: 'table',
  height: '50vh',
  margin: '0 auto',
};

const childContainerStyles = {
  display: 'table-cell',
  verticalAlign: 'middle',
};
const imageContainerStyle = { display: 'flex' };
const imageStyle = { margin: '0 auto', width: '100px' };

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

  const handleLogin = async () => {
    setSubmitted(true);

    if (isLoginFormValid(email, password)) {
      dispatch(updateLoading(true));
      const response = await logInWithEmailAndPassword(email, password);
      if (response !== undefined) {
        dispatch(updateLoading(false));
        toast.error(response.message);
      } else {
        navigate('/');
      }
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleSendEmail = () => {
    (async () => {
      try {
        await sendPasswordReset(email);
        toast(
          'Password reset link sent to you email. Please verify your spam folder.',
          { type: 'success' },
        );

        setShowResetDialog(false);
      } catch (error: any) {
        if (error.code === FirebaseLoginErrorCode.USER_NOT_FOUND) {
          toast('Email is not registered with us. Please try registering', {
            type: 'error',
          });
        } else {
          toast('Some error occurred. Please try again later', {
            type: 'error',
          });
        }
      }
    })();
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={childContainerStyles}>
        <Grid container spacing={2} sx={{ width: '350px' }}>
          <Grid item xs={12}>
            <Box sx={imageContainerStyle}>
              <img src={LoginIcon} alt="Login" style={imageStyle} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              error={submitted && (isFieldEmpty(email) || !isEmailValid(email))}
              helperText={
                submitted
                  ? isFieldEmpty(email)
                    ? 'Email cannot be empty'
                    : !isEmailValid(email)
                    ? 'Invalid email'
                    : undefined
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              error={submitted && isFieldEmpty(password)}
              helperText={
                submitted && isFieldEmpty(password)
                  ? 'Email cannot be empty'
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleLogin} fullWidth variant="contained">
              Login
            </Button>
            <Divider sx={{ marginTop: '10px' }} />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => setShowResetDialog(true)}
              fullWidth
              variant="outlined"
              color="inherit"
            >
              Reset password
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSignUp}
              fullWidth
              variant="outlined"
              color="secondary"
            >
              New user? Sign up here
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Password reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter registered email address
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button variant="outlined" color="success" onClick={handleSendEmail}>
            Send email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
