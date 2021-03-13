import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { projectAuth } from '../firebase/config';
import { TextField, Button, Grid, Backdrop, CircularProgress} from '@material-ui/core';
import { AuthContext } from './AuthContext';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  formArea: {
    minHeight: '80vh',
    textAlign: 'center',
  },
  fields: {
    margin: '15px',
  },
  textColor:{
    color: '#3f51b5',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#e0e0e0',
  },
}));

const Login = () => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(true);

    projectAuth.signInWithEmailAndPassword(email, password).then(cred => {
      return (
        <Redirect to={'/'}/>
      )
    }).catch(error => {
      switch(error.code){
        case 'auth/invalid-email':
          setEmailError(error.message);
          setPasswordError('');
          break;
        case 'auth/user-disabled':
          setEmailError(error.message);
          setPasswordError('');
          break;
        case 'auth/user-not-found':
          setEmailError(error.message);
          setPasswordError('');
          break;
        default:
          setPasswordError(error.message);
          setEmailError('');
      }
      setOpen(false);
    })
    setEmail('');
    setPassword('');
  }

  if (isLoading){
    return(
      <h1>Loading...</h1>
    )
  }
  //redirect if user already logged in
  if (currentUser){
    return <Redirect to={'/'}/>;
  }

  return (
    <Grid container spacing={0} direction='column' alignItems='center' justify='center' className={classes.formArea}>
      <Grid item xs={6} sm={3}>
        <form onSubmit={handleSubmit}>
          <h1 className={classes.textColor}>Login</h1>
          <div className={classes.fields}>
            <TextField
              required
              error={emailError.length === 0 ? false : true}
              id='email'
              label='Email'
              variant='outlined'
              type='email'
              value={email}
              helperText={emailError}
              fullWidth={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={classes.fields}>
            <TextField
              required
              error={passwordError.length === 0 ? false : true}
              id='password'
              label='Password'
              type='password'
              autoComplete='current-password'
              variant='outlined'
              value={password}
              helperText={passwordError}
              fullWidth={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant='contained' color='primary' type='submit' size='large'>Submit</Button>
        </form>
      </Grid>
      <Backdrop className={classes.backdrop} open={open} onClick={()=> setOpen(false)}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  );
}
 
export default Login;