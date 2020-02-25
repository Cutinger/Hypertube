import React, { useState } from 'react';
import {ButtonGroup, Grow, Typography, TextField, Button, Container, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import Logo from './../../assets/img/hypairtube-logov2.png'

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
        margin: theme.spacing(3, 0, 1, 0),
        borderRadius: '10px !important',
        color: 'white',
    },
    buttonFacebook: {
        '&:hover':{
            backgroundColor: '#35528d',
        },
        backgroundColor: '#4267b2',
        color: 'white'
    },
    button42: {
        '&:hover':{
            backgroundColor: '#1f1f1f',
        },
        backgroundColor: '#000000',
        color: 'white'
    },
    buttonGroup: {
        margin: theme.spacing(0, 0, 3, 0),
        borderRadius: '10px !important',
        overflow: 'hidden'
    },
    textfield: {
        '& fieldset': {
            borderRadius: '10px !important',
        }
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    }
  }));


  export default function Login(props) {
    const classes = useStyles();
    const [mounted, setMounted] = useState(true);

    const handleRedirectSignup = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/signup'); 
    };
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
                        <form className={classes.form} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
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
                                <Grid item xs={12}>
                                    <TextField
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
                            </Grid>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                color="primary"
                                className={classes.signupButton}
                            >
                                Sign in
                            </Button>
                            <ButtonGroup 
                                    fullWidth 
                                    size="large"
                                    variant="contained"
                                    aria-label="contained primary button group" 
                                    className={classes.buttonGroup}>
                                <Button  className={classes.button42}>42</Button>
                                <Button startIcon={<FacebookIcon />} className={classes.buttonFacebook}>Facebook</Button>
                            </ButtonGroup>
                            <Grid container justify="center">
                                <Grid item>
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