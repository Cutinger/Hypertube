import React, { useState } from 'react';
import {Grow, Fab, Paper, Typography, Checkbox, TextField, Button, Container, Grid, Link, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
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
        margin: theme.spacing(3, 0, 3, 0),
        borderRadius: '10px !important',
        color: 'white',
    },
    buttonGroup: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            flexDirection: 'column',
        },
        borderRadius: '10px !important',
    },
    textfield: {
        '& fieldset': {
            borderRadius: '10px !important',
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
    const [mounted, setMounted] = useState(true);


    // Box
    const isBoxChecked = Boolean(checkedImgBox);
    const handleBoxChecked = event => { setCheckedImgBox(!isBoxChecked) };
    const handleRedirectLogin = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/login'); 
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
                            Sign up
                        </Typography>
                        <form className={classes.form} noValidate>
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
                                        <AddIcon/>
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
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        className={classes.textfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        className={classes.textfield}
                                    />
                                </Grid>
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
                                Sign Up
                            </Button>
                            {/* <ButtonGroup fullWidth className={classes.buttonGroup} variant="contained" color="primary" aria-label="contained primary button group">
                                <Button>42</Button>
                                <Button>Facebook</Button>
                                <Button>Google</Button>
                                <Button>Github</Button>
                            </ButtonGroup> */}
                            <Grid container justify="center">
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