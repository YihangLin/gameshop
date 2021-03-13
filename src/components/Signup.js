import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { projectAuth } from '../firebase/config';
import { TextField, Button, Grid, Backdrop, CircularProgress} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { projectFirestore } from '../firebase/config';

const useStyles = makeStyles((theme) => ({
  formArea: {
    height: '80vh',
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
}))

const Signup = () => {
  const classes = useStyles();
  const { currentUser, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(true);

    //create user
    if (password === confirm){
      projectAuth.createUserWithEmailAndPassword(email, password).then(cred => {
        projectFirestore.collection('carts').doc(cred.user.uid).set({
          list: [],
          total: 0,
        })
        .then(() => {
          console.log('Total in carts created.');
        })
        .catch((error) => {
          console.log('Error creating total in carts: ', error);
        });
        setEmail('');
      }).catch(error => {
        switch(error.code){
          case 'auth/email-already-in-use':
            setEmailError(error.message);
            setPasswordError('');
            break;
          case 'auth/invalid-email':
            setEmailError(error.message);
            break;
          case 'auth/weak-password':
            setPasswordError(error.message);
            setEmailError('');
            break;
          default:
            setEmailError(error.message);
            setPasswordError('');
        }
        setOpen(false);
      })

      setPassword('');
      setConfirm('');
      setPassConfirm('');
    }else{
      setPassConfirm('The password confirmation does not match.');
      setPasswordError('');
      setEmailError('');
      setOpen(false);
    }
  }

  if (isLoading) {
    return (
      <h3>Loading...</h3>
    )
  }

  //redirect if user already logged in
  if (currentUser) {
    return <Redirect to={'/'}/>
  }

  return (
    <Grid container spacing={0} direction='row' alignItems='center' justify='center' className={classes.formArea}>
      <Grid item xs={6} sm={3}>
        <form onSubmit={handleSubmit}>
          <h1 className={classes.textColor}>Sign Up</h1>
          <div className={classes.fields}>
            <TextField
              required
              error={emailError.length === 0 ? false : true}
              id='email'
              label='Email'
              variant='outlined'
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
          <div className={classes.fields}>
            <TextField
              error={passConfirm.length === 0 ? false : true}
              required
              id='confirm'
              label='Confirm Password'
              type='password'
              autoComplete='current-password'
              variant='outlined'
              value={confirm}
              helperText={passConfirm}
              fullWidth
              onChange={(e) => setConfirm(e.target.value)}
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
 
export default Signup;