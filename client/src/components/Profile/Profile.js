import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
    Container,
    Divider,
    Grid,
    Avatar,
    TextField,
    Backdrop,
    CircularProgress,
    Fab,
    Checkbox, FormControlLabel
} from "@material-ui/core";
import ImageIcon from '@material-ui/icons/Image';
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import API from "../../utils/API";
import LockIcon from '@material-ui/icons/Lock';
import AddIcon from '@material-ui/icons/Add';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import InputAdornment from '@material-ui/core/InputAdornment';
import { store } from 'react-notifications-component';
import VALIDATION from "../../utils/validation";
import Cookies from "universal-cookie";

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
    },
    fileUploadInput: {
        position: 'absolute',
        left: '0',
        width: '100%',
        height: '100%',
        margin: '0',
        padding: '0',
        outline: 'none',
        opacity: '0',
        cursor: 'pointer'
    },
    imageUploadWrap: {
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '10px'
    },
    containerBottomButtons: {
        textAlign: 'center'
    }
}));

const defaultSrc = "https://i.ibb.co/hgvJPFb/default-Img-Profile.png";

const Profile = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [mounted, setMounted] = useState(false);
    const [loader, setLoader] = useState(false);
    const [defaultImg, setDefaultImg] = useState(defaultSrc);
    const [editPassword, setEditPassword] = useState(false)
    const [language, setLanguage] = React.useState('us');

    const translate = {
        fr: {
            fileWarning: "Désolé, nous acceptons uniquement jpg, jpeg, png / taille limite 2mb",
            MyProfile: "Mon profil",
            firstname: 'Prénom',
            lastname: 'Nom',
            email: 'Adresse e-mail',
            password: 'Mot de passe',
            password_confirm: 'Confirmation',
            username: "Nom d'utilisateur",
            errors: {
                email: "Merci d'utiliser une adresse e-mail valide",
                firstname: "Merci d'utiliser un prénom valide",
                lastname: "Merci d'utiliser un nom valide",
                password_strong: 'Mot de passe trop faible',
                password_required: 'Mot de passe requis',
                username: "Merci d'utiliser un nom d'utilisateur valide",
                password_confirm: 'Les mots de passe ne correspondent pas',
                usernameExist: "Nom d'utilisateur déjà pris",
                emailExist: "E-mail déjà pris"
            },
            useDefault: 'Image par défaut',
            addPicture: 'Ajouter une image',
            editPassword: 'Editer mot de passe',
            saveChanges: 'Sauvegarder'
        },
        us: {
            fileWarning: "Sorry, we only accept jpg, jpeg, png and max file size of 2mb",
            mailConfirmation: "A mail confirmation was send. Please active your account.",
            MyProfile: "My profile",
            firstname: 'First name',
            lastname: 'Last name',
            email: 'Email Address',
            password: 'Password',
            password_confirm: 'Confirm password',
            username: 'Username',
            errors: {
                email: 'Please use valid email',
                firstname: 'Please use valid first name',
                lastname: 'Please use valid last name',
                password_strong: 'Password must be strong',
                password_required: 'Password required',
                username: 'Please use valid username',
                password_confirm: 'Passwords must match',
                usernameExist: 'Username already exist',
                emailExist: 'Email already exist'
            },
            useDefault: 'Use default image',
            addPicture: 'Add picture',
            editPassword: 'Edit password',
            saveChanges: 'Save changes'
        }
    };

    useEffect(() => {
        const cookies = new Cookies();
        const getLg = cookies.get('lg');
        if (getLg && getLg !== language) {
            setLanguage(getLg);
        }
    },[language] );

    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
        }
    }));

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
        const {err_email, err_password, err_firstname, err_lastname, err_username, err_password_confirm} = validationErrors;
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
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value});
    };

    const handleSaveChanges = async () => {
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
            errors.email = translate[language].errors.email
        if (!VALIDATION.validateName(fieldValue.firstname))
            errors.firstname = translate[language].errors.firstname
        if (!VALIDATION.validateName(fieldValue.lastname))
            errors.lastname = translate[language].errors.lastname
        if (editPassword && (!fieldValue.password || !fieldValue.password.length))
            errors.password = translate[language].errors.password
        else if (editPassword && !VALIDATION.validatePassword(fieldValue.password))
            errors.password = translate[language].errors.password_strong
        if (editPassword && fieldValue.password !== fieldValue.password_confirm)
            errors.password_confirm = translate[language].errors.password_confirm
        if (!VALIDATION.validateUsername(fieldValue.username))
            errors.username = translate[language].errors.username
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
            let img;
            if (defaultSrc === defaultImg) img = true;
            else img = !Boolean(defaultImg);
            await API.updateUserProfil(fieldValue.firstname, fieldValue.lastname, fieldValue.username, fieldValue.email, fieldValue.password, fieldValue.password_confirm, img, editPassword)
                .then(response => {
                    if (response.status === 200)
                        console.log(response.data);
                })
                .catch(err => {
                    if (err.response.data){
                        setValidationErrors({
                            ...validationErrors,
                            err_username: err.response.data.err_username ?  translate[language].errors.usernameExist : false,
                            err_email: err.response.data.err_email ? translate[language].errors.emailExist : false
                        })
                    }
                    console.log(err.response.data);
                });
        }
        setLoader(false);
    }

    useEffect(() => {
        async function getUserProfile() {
            await API.getUserProfile()
                .then(res => {
                    if (res.status === 200 && res.data) {
                        setTextFieldsValues({
                            firstname: res.data.firstname,
                            lastname: res.data.lastname,
                            username: res.data.username,
                            email: res.data.email
                        })
                        setDefaultImg(res.data.img);
                        setMounted(true);
                    }
                })
        }

        if (!mounted) {
            getUserProfile()
        }
    }, [mounted]);

    const handleNotifFile = () => {
        store.addNotification({
            message:  translate[language].errors.fileWarning,
            insert: "top",
            type: 'success',
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });
    }

    const imagesFilesUpload = async (e) => {
        const cookies = new Cookies();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileSize = Math.round((file.size / 1024));
            if ((fileSize >= 4096) || (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg'))
                handleNotifFile();
            else {
                const formData = new FormData();
                formData.append('file', file);
                await API.updatePicture(formData, cookies.get('token'))
                    .then(res => {
                        if (res.status === 200 && res.data.img)
                            setDefaultImg(res.data.img);
                    })
                    .catch(err => {
                        handleNotifFile();
                    });
            }
        }
    };

    const handleCheckboxImg = () => {
        setDefaultImg(defaultSrc);
    };
    return (
        <Container component="main" maxWidth={"md"} className={classes.containerGridTopMovie}>
            <form noValidate>
                {/* Loader -> when page load */}
                <Backdrop className={classes.backdrop} open={!mounted}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{translate[language].MyProfile}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                <div className={classes.profileContainer}>
                    <Grid style={{marginTop: '1.5em'}} container alignContent={"center"} direction="row"
                          justify="space-evenly" alignItems="center">
                        <Grid item sm={6}>
                            <Grid container direction={"column"} alignItems="center" alignContent={'center'}>
                                <Grid item>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={defaultImg}
                                        className={classes.large}
                                    />
                                </Grid>
                                <Grid item>
                                    <div className={classes.imageUploadWrap}>
                                        <Fab variant="extended" size="small" className={classes.addPicture}>
                                            <AddIcon/>
                                            {translate[language].addPicture}
                                        </Fab>
                                        <input
                                            className={classes.fileUploadInput}
                                            type="file"
                                            onChange={imagesFilesUpload}
                                            accept="image/png, image/jpg, image/jpeg"
                                        />
                                    </div>
                                </Grid>
                                <Grid item>
                                    <Fab onClick={handleCheckboxImg} variant="extended" size="small"
                                         className={classes.addPicture}>
                                        <ImageIcon/>
                                        {translate[language].useDefault}
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={6}>
                            <Grid className={classes.containerInfos} container direction={"column"} alignItems="stretch"
                                  alignContent={'center'}>
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
                                        label={translate[language].firstname}
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
                                        required
                                        label={translate[language].lastname}
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
                                        label={translate[language].username}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle/>
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
                                        label={translate[language].password}
                                        type="password"
                                        id="password"
                                        required={editPassword}
                                        disabled={!editPassword}
                                        autoComplete={"true"}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon/>
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
                                        variant="filled"
                                        fullWidth
                                        name="password_confirm"
                                        label={translate[language].password_confirm}
                                        type="password"
                                        id="password_confirm"
                                        autoComplete={"true"}
                                        disabled={!editPassword}
                                        required={editPassword}
                                        className={classnames(classes.textfield, classes.textfieldbetween)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon/>
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
                                        label={translate[language].email}
                                        name="email"
                                        className={classnames(classes.textfield, classes.textfieldbottom)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailIcon/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid style={{marginTop: '3em'}} container alignContent={'center'} justify={'center'}
                          alignItems={'center'}>
                        <Grid item>
                            <div className={classes.containerBottomButtons}>
                                <Fab onClick={handleEditPassword} variant="extended" size="medium"
                                     className={classes.saveChanges} style={{marginRight: '10px'}}>
                                    <FormControlLabel
                                        className={classes.FormControlLabel}
                                        checked={editPassword}
                                        onClick={handleEditPassword}
                                        value={translate[language].editPassword}
                                        control={<Checkbox color="primary"/>}
                                        label={translate[language].editPassword}
                                        labelPlacement="start"
                                    />
                                </Fab>
                                <Fab onClick={handleSaveChanges} variant="extended" size="medium"
                                     className={classes.saveChanges}>
                                    {loader ? <CircularProgress size={24} className={classes.commentProgress}/> :
                                        <CheckIcon/>}
                                    {loader ? null : translate[language].saveChanges}
                                </Fab>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </form>
        </Container>
    )
}));

export default Profile;