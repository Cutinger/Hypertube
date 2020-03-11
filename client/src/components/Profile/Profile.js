import React, {useState, useEffect} from 'react';
import {Container, Divider, Grow, Grid, Avatar, TextField, Backdrop, CircularProgress, Fab} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import Cookies from "universal-cookie";
import API from "../../utils/API";
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    containerGridTopMovie: {
        marginTop: theme.spacing(8)
    },
    title: {
        marginBottom: '0',
        textAlign: 'left',
        color: 'white',
        fontSize: '2.2em',
        fontWeight: '100',
        fontFamily: 'Open-Sans, sans-serif',
        textShadow: '6px 12px 22px #bd20857a'
    },
    titleContainer: {
        padding: '8px',
    },
    topBackground: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '500px',
        width: '100%',
        zIndex: -1,
        background: 'linear-gradient(-180deg, #0d1c37 40%, rgba(0, 0, 0, 0) ) !important'
    },
    dividerTitle: {
        background: 'linear-gradient(-90deg, #3f51b5, rgba(255,255,255,0))',
        marginBottom : '1.5em',
        paddingTop: '1.5px',
        borderRadius: '10px',
        opacity: '0.25',
        boxShadow: '6px 12px 22px #bd20857a'
    },
    large: {
        width: theme.spacing(25),
        height: theme.spacing(25),
        boxShadow: '2px 2px 1px #11305f !important',
    },
    textfield: {
        width: '100% !important',
        '& > .MuiFilledInput-root': {
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
            backgroundColor: '#11305f !important',
            color: '#c5c5c5'
        },
        '&input:placeholder': {
          color: 'white !important'
        },
        '& .MuiFormHelperText-contained':{
            color: 'red'
        },
        '& .MuiInputLabel-filled':{
            color: 'white !important'
        },
        '& .MuiFilledInput-underline:after': {
            borderColor: 'white !important'
        },
        '& .MuiFilledInput-underline:before': {
            borderColor: '1px solid rgb(0, 0, 0) !important'
        }
    },
    textfieldbetween: {
        ' & >.MuiFilledInput-root': {
            borderTopRightRadius: '0px !important',
            borderTopLeftRadius: '0px !important',
        }
    },
    textfieldbottom: {
        ' & >.MuiFilledInput-root': {
            borderTopRightRadius: '0px !important',
            borderTopLeftRadius: '0px !important',
            borderBottomLeftRadius: '10px !important',
            borderBottomRightRadius: '10px !important',
        }
    },
    saveChanges: {
        background: '#11305f',
        color: 'white',
        textAlign: 'center',
        borderRadius: '10px',
        marginTop: '1.5em',
        '&:hover': {
            background: '#1c519f',
        }
    },
}));


export default function Profile(props){
    const classes = useStyles();
    const [mounted, setMounted] = useState(true);

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
    });

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

    useEffect(() => {
       if (!mounted)
           setMounted(true);
    }, [mounted]);

    return (
        <Grow in={mounted}>
            <Container component="main" maxWidth={"md"} className={classes.containerGridTopMovie}>
                {/* Loader -> when page load */}
                <Backdrop className={classes.backdrop} open={mounted ? false : true} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div className={classes.topBackground} />
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>My profile</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                <div className={classes.profileContainer}>
                    <Grid style={{marginTop: '1.5em'}} container alignContent={"center"} direction="row" justify="space-evenly" alignItems="center">
                        <Grid item sm={6}>
                            <Grid container direction={"column"} alignItems="center" alignContent={'center'}>
                                <Grid item>
                                    <Avatar alt="Remy Sharp" src="https://i.ibb.co/hgvJPFb/default-Img-Profile.png" className={classes.large}/>
                                </Grid>
                                <Grid item style={{marginTop: '10px'}}>
                                    <Fab variant="extended" size="medium" className={classes.saveChanges} >
                                        <AddIcon />
                                        Add picture
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={6}>
                            <Grid style={{width: '100% !important'}} container direction={"column"}  alignItems="stretch" alignContent={'center'}>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.firstname || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_firstname}
                                        error={Boolean(validationErrors.err_firstname)}
                                        name="firstname"
                                        variant="filled"
                                        required
                                        id="firstname"
                                        label="First Name"
                                        className={classes.textfield}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.lastname || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_lastname}
                                        error={Boolean(validationErrors.err_lastname)}
                                        name="lastname"
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="lastnamet"
                                        label="Last Name"
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                    <TextField
                                        value={fieldValue.username || ''}
                                        onChange={handleChange}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        name="username"
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
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
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
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
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} style={{width: '100%'}}>
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
                                        className={classnames(classes.textfield, classes.textfieldbottom)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </Grow>
    )
}