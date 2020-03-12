import React, {useState, useEffect} from 'react';
import {
    Container,
    Divider,
    Grow,
    Grid,
    Avatar,
    TextField,
    Backdrop,
    CircularProgress,
    Fab,
    Checkbox, FormControlLabel
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import API from "../../utils/API";
import LockIcon from '@material-ui/icons/Lock';
import AddIcon from '@material-ui/icons/Add';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import InputAdornment from '@material-ui/core/InputAdornment';
import VALIDATION from "../../utils/validation";

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
        width: theme.spacing(26),
        height: theme.spacing(26),
        boxShadow: '3px 3px 1px #202e428c !important',
    },
    textfield: {
        width: '100% !important',
        '& > .MuiFilledInput-root': {
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
            backgroundColor: '#202e428c !important;',
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
            borderColor: '#18468a !important',
            borderRadius: '10px'
        },
        '& .MuiFilledInput': {
           overflow:'hidden'
        },
        '& .MuiFilledInput-underline:before': {
            borderColor: '1px solid rgb(0, 0, 0) !important',
        },
        '& .MuiFilledInput-underline': {
            borderColor: '1px solid white !important'
        },
        '& .MuiFilledInput-input': {
            padding: '35px 15px 15px !important'
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
            borderBottomRightRadius: '10px !important',
            borderBottomLeftRadius: '10px !important',

        }
    },
    saveChanges: {
        background: '#18468a',
        color: 'white',
        textAlign: 'center',
        borderRadius: '10px !important',
        marginTop: '1.5em',
        '&:hover': {
            background: '#174282',
        }
    },
    addPicture: {
        background: '#202e42 !important',
        color: 'white',
        textAlign: 'center',
        borderRadius: '10px !important',
        marginTop: '1.5em',
        fontSize: '0.8em',
        '&:hover': {
            background: '#202e42 !important',
        }
    },
    containerInfos: {
        width: '100% !important',
        [theme.breakpoints.down('xs')]: {
            marginTop: '1.6em'
        },
    },
    commentProgress: {
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    FormControlLabel: {
        ' & >.MuiTypography-root': {
            fontSize: '0.875rem !important',
            fontWeight: '500 !important'
        },
        '& > .MuiCheckbox-colorPrimary.Mui-checked': {
            color: 'white'
        },
        '.MuiSvgIcon-root': {
            color: 'white !important'
        }
    }
}));


export default function Profile(props){
    const classes = useStyles();
    const [mounted, setMounted] = useState(false);
    const [loader, setLoader] = useState(false);
    const [defaultImg, setDefaultImg] = useState(true);
    const [editPassword, setEditPassword] = useState(false)


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
        username: '',
    });

    const handleEditPassword = () => {
        setEditPassword(!editPassword);
        setValidationErrors({
            err_password_confirm: false,
            err_password: false
        })
    }

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
    };

    const handleSaveChanges = async() => {
        setLoader(true);
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
        if (editPassword && (!fieldValue.password || !fieldValue.password.length))
            errors.password = 'Password required';
        else if (editPassword && !VALIDATION.validatePassword(fieldValue.password))
            errors.password = 'Please use strong password';
        if (editPassword && fieldValue.password !== fieldValue.password_confirm)
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
            await API.updateUserProfil(fieldValue.firstname, fieldValue.lastname, fieldValue.username,fieldValue.email, fieldValue.password, fieldValue.password_confirm, defaultImg, editPassword)
                .then(response => {
                    if (response.status === 200)
                       console.log(response.data);
                })
                .catch(err => {
                    // if (err.response.data && typeof err.response.data.same_username !== 'undefined'){
                    //     setValidationErrors({
                    //         ...validationErrors,
                    //         err_username: err.response.data.same_username ? 'Username already exist' : false,
                    //         err_email: err.response.data.same_email ? 'Email already exist' : false
                    //     })
                    // }
                    console.log(err);
                });
        }
        setLoader(false);
    }

    useEffect(() => {
       async function getUserProfile(){
           await API.getUserProfile()
               .then(res => {
                   if (res.status === 200 && res.data)
                      setTextFieldsValues({
                          firstname: res.data.firstname,
                          lastname: res.data.lastname,
                          username: res.data.username,
                          email: res.data.email
                      })
               })
       }
       if (!mounted) {
           getUserProfile()
           setMounted(true);
       }
    }, [mounted]);

    return (
        <Grow in={mounted}>
            <Container component="main" maxWidth={"md"} className={classes.containerGridTopMovie}>
                <form noValidate>
                    {/* Loader -> when page load */}
                    <Backdrop className={classes.backdrop} open={mounted ? false : true} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
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
                                    <Grid item>
                                        <Fab variant="extended" size="small" className={classes.addPicture} >
                                            <AddIcon />
                                            Add picture
                                        </Fab>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={6}>
                                <Grid className={classes.containerInfos} container direction={"column"}  alignItems="stretch" alignContent={'center'}>
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
                                            fullWidth
                                            id="lastname"
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
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountCircle />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                        <TextField
                                            value={fieldValue.password || ''}
                                            helperText={validationErrors.err_password}
                                            error={Boolean(validationErrors.err_password)}
                                            onChange={handleChange}
                                            variant="filled"
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            required={editPassword}
                                            disabled={!editPassword}
                                            autoComplete={"true"}
                                            className={classnames(classes.textfield, classes.textfieldbetween)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8} style={{width: '100%'}}>
                                        <TextField
                                            value={fieldValue.password_confirm || ''}
                                            helperText={validationErrors.err_password_confirm}
                                            error={Boolean(validationErrors.err_password_confirm)}
                                            onChange={handleChange}
                                            variant="filled"s
                                            fullWidth
                                            name="password_confirm"
                                            label="Password Confirm"
                                            type="password"
                                            id="password_confirm"
                                            autoComplete={"true"}
                                            disabled={!editPassword}
                                            required={editPassword}
                                            className={classnames(classes.textfield, classes.textfieldbetween)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon />
                                                    </InputAdornment>
                                                )
                                            }}
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
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid style={{marginTop: '3em'}}container alignContent={'center'} justify={'center'} alignItems={'center'}>
                            <Grid item>
                                <div className={classes.containerBottomButtons}>
                                    <Fab onClick={handleSaveChanges} variant="extended" size="large" className={classes.saveChanges} style={{marginRight: '10px'}} >
                                        {loader ? <CircularProgress size={24} className={classes.commentProgress} /> : <CheckIcon /> }
                                        {loader ? null : 'Save changes'}
                                    </Fab>
                                    <Fab onClick={handleEditPassword} variant="extended" size="large" className={classes.saveChanges} >
                                        <FormControlLabel
                                            className={classes.FormControlLabel}
                                            checked={editPassword}
                                            onClick={handleEditPassword}
                                            value="Edit password"
                                            control={<Checkbox color="primary" />}
                                            label="Edit password"
                                            labelPlacement="start"
                                        />
                                    </Fab>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </form>
            </Container>
        </Grow>
    )
}