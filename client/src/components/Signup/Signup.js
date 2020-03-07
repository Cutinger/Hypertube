import React, {useEffect, useState} from 'react';
import {Grow, ButtonGroup, Fab, Paper, Typography, Checkbox, TextField, Button, Container, Grid, Link, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import iconSet from './../Icon/selection.json';
import FacebookIcon from '@material-ui/icons/Facebook';
import IcomoonReact from "icomoon-react";
import Logo from './../../assets/img/hypairtube-logov2.png'
import VALIDATION from './../../utils/validation';
import API from './../../utils/API';
import Cookies from "universal-cookie";

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
    buttonGroup: {
        margin: theme.spacing(0, 0, 3, 0),
        borderRadius: '10px !important',
        overflow: 'hidden'
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
    textfield: {
        '& fieldset': {
            borderRadius: '10px !important',
        },
        '& .MuiFormHelperText-contained':{
            color: 'red'
        }
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    imagePreviewContainer: {
        width: '100%',
        height: '150px',
        overflow: 'hidden',
        backgroundClip: 'content-box',
        position: 'relative',
        borderRadius: '10px'
        
    },
    imagePreview: {
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        minHeight: '100%',
        minWidth: '100%',
        transform: 'translate(-50%, -50%)'
    },
    addPicture: {
        background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% ) !important',
        color: 'white',
        textAlign: 'center',
        marginTop: '10px',
    },
    itemsPhotos: {
        textAlign: 'center'
    }
    
  }));


  export default function Signup(props) {
    const classes = useStyles();
    const [checkedImgBox, setCheckedImgBox] = React.useState(true);
    // Warnings after validation
    const [validationErrors, setValidationErrors] = React.useState({
        err_firstname: false,
        err_lastname: false,
        err_email: false,
        err_password: false,
        err_username: false,
        err_password_confirm: false,
    });
    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirm: '',
        username: ''
    })
    const [mounted, setMounted] = useState(true);
    // Box
    const isBoxChecked = Boolean(checkedImgBox);
    const handleBoxChecked = () => { setCheckedImgBox(!isBoxChecked) };
    const handleRedirectLogin = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/login'); 
    };

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
                      .catch((err) => cookies.remove('token'));
          }
          fetchAPI();
      }, [mounted, props.history]);

    /* Input onChange -> Update value, store it in state(setTextFieldsValues), if user has a previous warnings then dismiss it with false */
    const handleChange = (event) => {
        const { err_email, err_password, err_firstname, err_lastname, err_username, err_password_confirm } = validationErrors;
        if (event.target.id === "email" && err_email)
            setValidationErrors({...validationErrors, err_email: false});
        if (event.target.id === "password" && err_password)
            setValidationErrors({...validationErrors, err_password: false});
        if (event.target.id === "firstname" && err_firstname)
            setValidationErrors({...validationErrors, err_firstname: false});
        if (event.target.id === "password_confirm" && err_password_confirm)
            setValidationErrors({...validationErrors, err_firstname: false});
        if (event.target.id === "username" && err_username)
            setValidationErrors({...validationErrors, err_username: false});
        if (event.target.id === "lastname" && err_lastname)
            setValidationErrors({...validationErrors, err_lastname: false});
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value });
    }
    // Signup
    const handleSignupClicked = (e) => {
        e.preventDefault();
        /* VALIDATION */
        const errors = {
            firstname: false,
            lastname: false,
            email: false,
            password: false,
            password_confirm: false,
            username: false,
        }
        if (!VALIDATION.validateEmail(fieldValue.email))
            errors.email = 'Please use valid email';
        if (!VALIDATION.validateName(fieldValue.firstname))
            errors.firstname = 'Please use valid first name';
        if (!VALIDATION.validateName(fieldValue.lastname))
            errors.lastname = 'Please use valid last name';
        if (!fieldValue.password.length)
            errors.password = 'Password required';
        else if (!VALIDATION.validatePassword(fieldValue.password))
            errors.password = 'Please use strong password';
        if (fieldValue.password !== fieldValue.password_confirm)
            errors.password_confirm = 'Passwords must match';
        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = 'Please use valid username';
        setValidationErrors({
            err_password: errors.password,
            err_password_confirm: errors.password_confirm,
            err_email: errors.email,
            err_firstname: errors.firstname,
            err_lastname: errors.lastname,
            err_username: errors.username
        });
        /* SEND REQUEST */
        if (!errors.firstname && !errors.lastname && !errors.email && !errors.password && !errors.username && !errors.password_confirm) {
            API.register(fieldValue.firstname, fieldValue.lastname, fieldValue.email, fieldValue.username, fieldValue.password, fieldValue.password_confirm)
            .then(response => {
                if (response.status === 200)
                    props.history.push('/')
                    console.log(3);
            })
            .catch(err => {
                if (err.response.data && typeof err.response.data.same_username !== 'undefined'){
                    setValidationErrors({
                        ...validationErrors, 
                        err_username: err.response.data.same_username ? 'Username already exist' : false,
                        err_email: err.response.data.same_email ? 'Email already exist' : false
                    })
                }
            });
        }
    }
    
    // HandleFacebookConnection
    const handleFacebookConnection = () => {
        API.facebookAuth()
            .then(res => {
                if (res.status === 200)
                    props.history.push('/home')
                else
                    console.log(['Res error', res]);
            })
            .catch(err => {
                console.log(['Catch error', err]);
            })
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
                            Sign up
                        </Typography>
                        <form className={classes.form} onSubmit={handleSignupClicked} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid  className={classes.itemsPhotos} item xs={8} sm={6}>
                                    <FormControlLabel
                                        checked={isBoxChecked}
                                        onClick={handleBoxChecked}
                                        value="Use default picture"
                                        control={<Checkbox color="primary" />}
                                        label="Use default picture"
                                        labelPlacement="start"
                                    />
                                    <Fab variant="extended" size="medium" className={classes.addPicture} >
                                        <AddIcon />
                                        Add picture
                                    </Fab>
                                </Grid>
                                <Grid item xs={4} sm={6}>
                                    <Paper className={classes.imagePreviewContainer} elevation={3}>
                                        <img
                                            src={'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                            className={classes.imagePreview}
                                            alt="Hypertube"
                                        />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fieldValue.firstname || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_firstname}
                                        error={Boolean(validationErrors.err_firstname)}
                                        autoComplete="fname"
                                        name="firstname"
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="firstname"
                                        label="First Name"
                                        autoFocus
                                        className={classes.textfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fieldValue.lastname || ''}
                                        helperText={validationErrors.err_lastname} 
                                        error={Boolean(validationErrors.err_lastname)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="lastname"
                                        label="Last Name"
                                        name="lastname"
                                        autoComplete="lname"
                                        className={classes.textfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fieldValue.email || ''}
                                        helperText={validationErrors.err_email}
                                        error={Boolean(validationErrors.err_email)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        className={classes.textfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fieldValue.username || ''}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        className={classes.textfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fieldValue.password || ''}
                                        helperText={validationErrors.err_password}
                                        error={Boolean(validationErrors.err_password)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        className={classes.textfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fieldValue.password_confirm || ''}
                                        helperText={validationErrors.err_password_confirm}
                                        error={Boolean(validationErrors.err_password_confirm)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password_confirm"
                                        label="Password Confirm"
                                        type="password"
                                        id="password_confirm"
                                        autoComplete="current-password"
                                        className={classes.textfield}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                color="primary"
                                type="submit"
                                className={classes.signupButton}
                                onClick={handleSignupClicked}
                            >
                                Sign Up
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
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link onClick={handleRedirectLogin} href="#" variant="body2">
                                        Already have an account? Sign in
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