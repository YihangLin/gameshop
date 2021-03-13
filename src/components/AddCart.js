import { Button, Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { projectFirestore } from '../firebase/config';
import CloseIcon from '@material-ui/icons/Close';
import { AuthContext } from './AuthContext';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
  snackwarning: {
    backgroundColor: '#ff5252',
    
  },
  snacksuccess: {
    backgroundColor: '#2196f3',
  },
  snackalready: {
    backgroundColor: '#ffeb3b',
    color: '#212121',
  },
}));

const AddCart = ({name, game}) => {

  const { currentUser } = useContext(AuthContext);
  const [snackCart, setSnackCart] = useState(false);
  const [snackCartError, setSnackCartError] = useState(false);
  const [snackLogin, setSnackLogin] = useState(false);
  const [snackInCart, setSnackInCart] = useState(false);
  const collectionRef = projectFirestore.collection('carts');
  const classes = useStyles();

  const addCart = (game) => {
    if (currentUser){
      collectionRef.doc(currentUser.uid).get()
      .then((doc) => {
        if(doc.exists && (doc.data().list.length !== 0)){
          //check if game is already in the cart
          for(let i = 0; i < doc.data().list.length; i++){
            if(doc.data().list[i].id === game.id){
              setSnackInCart(true);
              break;
            }else{
              if (i === doc.data().list.length - 1){
                collectionRef.doc(currentUser.uid).update({
                  list: firebase.firestore.FieldValue.arrayUnion(game),
                  total: firebase.firestore.FieldValue.increment(game.price),
                })
                .then(() => {
                  console.log('Game added to cart');
                  setSnackCart(true);
                  setSnackCartError(false);
                  setSnackLogin(false);
                })
                .catch((error) => {
                  console.log('Error adding to cart: ', error);
                  setSnackCartError(true);
                  setSnackLogin(false);
                  setSnackCart(false);
                });
              }
            }
          }

        }else{
          //if the list is empty, update the list
          collectionRef.doc(currentUser.uid).set({
            list: [game],
            total: firebase.firestore.FieldValue.increment(game.price),
          })
          .then(() => {
            console.log('Game added to cart');
            setSnackCart(true);
            setSnackCartError(false);
            setSnackLogin(false);
          })
          .catch((error) => {
            console.log('Error adding to cart: ', error);
            setSnackCartError(true);
            setSnackLogin(false);
            setSnackCart(false);
          });
        }
      })
      .catch((error)=> {
        console.log('Error getting carts: ', error);
      })
    }else{
      console.log('Please login');
      setSnackCart(false);
      setSnackCartError(false);
      setSnackLogin(true);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackCart(false);
    setSnackCartError(false);
    setSnackLogin(false);
    setSnackInCart(false);
  }

  return (
    <div>
      <Button onClick={() => addCart(game)} size='small' color='primary' variant='contained' startIcon={<ShoppingCartOutlinedIcon />}>
        {name}
      </Button>

      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackInCart}
          autoHideDuration={3000}
          onClose={handleClose}
      >
          <SnackbarContent 
            message='Game already in cart.' 
            className={classes.snackalready} 
            action={
              <React.Fragment>
                <IconButton size='small' aira-label='close' color='inherit' onClick={handleClose}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              </React.Fragment>
            }
          />
      </Snackbar>

      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackLogin}
          autoHideDuration={3000}
          onClose={handleClose}
      >
          <SnackbarContent 
            message='Please Login.' 
            className={classes.snackwarning} 
            action={
              <React.Fragment>
                <IconButton size='small' aira-label='close' color='inherit' onClick={handleClose}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              </React.Fragment>
            }
          />
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackCart}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent 
          message='Game added to cart.' 
          className={classes.snacksuccess} 
          action={
            <React.Fragment>
              <IconButton size='small' aira-label='close' color='inherit' onClick={handleClose}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackCartError}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent 
          message='Error adding to cart.' 
          className={classes.snackwarning} 
          action={
            <React.Fragment>
              <IconButton size='small' aira-label='close' color='inherit' onClick={handleClose}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />
      </Snackbar>
    </div>
  );
}
 
export default AddCart;