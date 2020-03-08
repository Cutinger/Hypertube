import React, { useState, useEffect } from 'react';
import {ButtonGroup, Grow, Typography, TextField, Button, Container, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import iconSet from './../Icon/selection.json';
import IcomoonReact from "icomoon-react";
import Logo from './../../assets/img/hypairtube-logov2.png'
import VALIDATION from './../../utils/validation';
import API from './../../utils/API';
import Cookies from 'universal-cookie';



// Style
const useStyles = makeStyles(theme => ({
    loginContainer: {
        padding: '9em 0 0 0',
        margin: 'auto',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(5),
    },
    login: {
        marginTop: 'auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: theme.spacing(3),
        boxShadow: '1px 1px 42px rgba(238, 28, 115,0.2);',
    },
    logo: {
        maxWidth: '100%',
        height: 'auto !important'
    },
    topContainerLogo: {
        background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(-3),
        padding: theme.spacing(3),
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',

    },
    signupButton: {
        background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(3, 0, 3, 0),
        borderRadius: '10px !important',
        color: 'white',
    },
    buttonFacebook: {
        '&:hover':{
            backgroundColor: '#35528d',
        },
        textTransform: 'none',
        backgroundColor: '#4267b2',
        color: 'white'
    },
    button42: {
        '&:hover':{
            backgroundColor: '#1f1f1f',
        },
        borderRight: 'none !important',
        textTransform: 'none',
        backgroundColor: '#000000',
        color: 'white'
    },
    buttonGroup: {
        margin: theme.spacing(0, 0, 3, 0),
        borderRadius: '10px !important',
        overflow: 'hidden'
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    signupItem: {
        textAlign: 'right !important',
    }
  }));


  export default function Login(props) {
    const classes = useStyles();
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
       async function fetchAPI() {
        const cookies = new Cookies();
            if (cookies.get('token'))
                await API.withAuth()
                    .then(res => {
                        if (res.status === 200){
                            props.history.push('/');
                        }
                    })
                    .catch((err) => { console.log(err); cookies.remove('token')})
        }
        fetchAPI();
    }, [mounted, props.history]);
    
    // Signup redirect
    const handleRedirectSignup = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/signup'); 
    };
    // Forgot password
    const handleRedirectForgot = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/forgot'); 
    };

    // HandleFacebookConnection
    const handleFacebookConnection = () => {
        API.facebookAuth()
            .then(res => {
                if (res.status === 200)
                    props.history.push('/');
                else
                    console.log(['Res error', res]);
            })
            .catch(err => {
                console.log(['Catch error', err]);
            })
    }

    // Warnings after validation
    const [validationErrors, setValidationErrors] = React.useState({ err_username: false, err_password: false });
    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({ username: '', password: ''})

      /* Input onChange -> Update value, store it in state(setTextFieldsValues), if user has a previous warnings then dismiss it with false */
    const handleChange = (event) => {
        const { err_username, err_password } = validationErrors;
        if (event.target.id === "username" && err_username)
            setValidationErrors({...validationErrors, err_username: false});
        if (event.target.id === "password" && err_password)
            setValidationErrors({...validationErrors, err_password: false});
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value });
    }
    // Signup
    const handleSignInClicked = (e) => {
        e.preventDefault();
        /* VALIDATION */
        const errors = { username: false, password: false }
        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = 'Please use valid username';
        if (!fieldValue.password.length)
            errors.password = 'Password required';
        else if (!VALIDATION.validatePassword(fieldValue.password))
            errors.password = 'Please use strong password';
        setValidationErrors({ err_password: errors.password, err_username: errors.username });
        /* SEND REQUEST */
        if (!errors.username && !errors.password) {
            API.login(fieldValue.username, fieldValue.password)
            .then(response => {
                if (response.status === 200){
                    props.history.push('/')
                }
            })
            .catch(err => setValidationErrors({...validationErrors, err_username: 'Incorrect username or password' }));
        }
    }
    return (
        <div className={classes.loginContainer}>
            <Grow in={mounted}>
                <Container className={classes.login} component="main" maxWidth="xs">
                    <div className={classes.topContainerLogo}>
                        <img
                            src={Logo}
                            className={classes.logo}
                            alt="Hypertube"
                        />
                    </div>
                    {/* <CssBaseline /> */}
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form} onSubmit={handleSignInClicked} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleChange}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleChange}
                                        helperText={validationErrors.err_password}
                                        error={Boolean(validationErrors.err_password) || Boolean(validationErrors.err_username)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.signupButton}
                                onClick={handleSignInClicked}
                            >
                                Sign in
                            </Button>
                            <ButtonGroup 
                                    fullWidth 
                                    size="large"
                                    variant="contained"
                                    aria-label="contained primary button group" 
                                    className={classes.buttonGroup}>
                                <Button 
                                    startIcon={<IcomoonReact iconSet={iconSet} color="#ffff" size={22} icon="42" />} 
                                    className={classes.button42}>
                                    Auth
                                </Button>
                                <Button
                                    onClick={handleFacebookConnection}
                                    startIcon={<FacebookIcon />}
                                    className={classes.buttonFacebook}>
                                    Facebook
                                </Button>
                            </ButtonGroup>
                            <Grid container justify="center">
                                <Grid item xs={4}>
                                    <Link onClick={handleRedirectForgot} href="#" variant="body2">
                                        Forgot password ?
                                    </Link>
                                </Grid>
                                <Grid className={classes.signupItem} item xs={8}>
                                    <Link onClick={handleRedirectSignup} href="#" variant="body2">
                                        Don't have an account? Sign up
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </Grow>
        </div>
        );
    }