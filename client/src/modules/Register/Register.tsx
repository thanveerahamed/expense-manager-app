import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {isSignUpFormValid} from './validator';
import {Box, Button, Grid, TextField} from '@mui/material';

import {registerWithEmailAndPassword} from '../../common/firebase/firebase';
import {isEmailValid, isFieldEmpty} from '../../common/validators';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSignUp = async () => {
        setSubmitted(true);

        if (isSignUpFormValid(name, email, password)) {
            const response = await registerWithEmailAndPassword(
                name,
                email,
                password,
            );
            if (response !== undefined) {
                toast.error(response.message);
            }
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <Box sx={{display: 'table', height: '40vh', margin: '0 auto'}}>
            <Box sx={{display: 'table-cell', verticalAlign: 'middle'}}>
                <Grid container spacing={2} sx={{width: '350px'}}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            id="signup-name"
                            label="Name"
                            onChange={(event) => setName(event.target.value)}
                            value={name}
                            error={submitted && isFieldEmpty(name)}
                            helperText={
                                submitted && isFieldEmpty(name)
                                    ? 'Name cannot be empty'
                                    : undefined
                            }
                        />
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
                        <Button onClick={handleSignUp} fullWidth variant="contained">
                            Register
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleLoginClick}
                            fullWidth
                            variant="outlined"
                            color="secondary"
                        >
                            Existing user? Login here
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Register;
