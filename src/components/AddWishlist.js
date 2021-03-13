import { Button, Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { projectFirestore } from '../firebase/config';
import CloseIcon from '@material-ui/icons/Close';
import { AuthContext } from './AuthContext';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
  snackwarning: {
    backgroundColor: '#ff5252',
    
  },
  snacksuccess: {
    backgroundColor: '#9575cd',
  },
  button:{
    marginRight: 15,
  },
}));

const AddWishlist = ({name, game}) => {

  const { currentUser } = useContext(AuthContext);
  const [snackWishlist, setSnackWishlist] = useState(false);
  const [snackWishlistError, setSnackWishlistError] = useState(false);
  const [snackLogin, setSnackLogin] = useState(false);
  const collectionRef = projectFirestore.collection('wishlists');
  const classes = useStyles();

  const addWishlist = (game) => {
    if (currentUser){
      collectionRef.doc(currentUser.uid).get()
      .then((doc) => {
        if (doc.exists){
          //update wishlist in firestore
          collectionRef.doc(currentUser.uid).update({
            list: firebase.firestore.FieldValue.arrayUnion(game),
          })
          .then(() => {
            console.log('Game added to wishlist');
            setSnackWishlist(true);
            setSnackWishlistError(false);
            setSnackLogin(false);
          })
          .catch((error) => {
            console.log('Error adding to wishlist: ', error);
            setSnackWishlistError(true);
            setSnackLogin(false);
            setSnackWishlist(false);
          });
        }else{
          //create the list, if the wishlist is empty
          collectionRef.doc(currentUser.uid).set({
            list: [game],
          })
          .then(() => {
            console.log('Game added to wishlist');
            setSnackWishlist(true);
            setSnackWishlistError(false);
            setSnackLogin(false);
          })
          .catch((error) => {
            console.log('Error adding to wishlist: ', error);
            setSnackWishlistError(true);
            setSnackLogin(false);
            setSnackWishlist(false);
          });
        }
      })
      .catch((error) => {
        console.log('Error gettting wishlists: ', error)
      })
    }else{
      console.log('Please login');
      setSnackWishlist(false);
      setSnackWishlistError(false);
      setSnackLogin(true);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackWishlist(false);
    setSnackWishlistError(false);
    setSnackLogin(false);
  }

  return (
    <div>
      <Button onClick={() => addWishlist(game)} className={classes.button} size='small' color='secondary' variant='contained' startIcon={<FavoriteOutlinedIcon />}>
        {name}
      </Button>

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
        open={snackWishlist}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent 
          message='Game added to wishlist.'
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
        open={snackWishlistError}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent 
          message='Error adding to wishlist.' 
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
 
export default AddWishlist;