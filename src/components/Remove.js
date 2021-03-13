import React, { useState } from 'react';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import firebase from 'firebase/app';
import { projectFirestore } from '../firebase/config';
import CloseIcon from '@material-ui/icons/Close';


const Remove = ({name, id, game}) => {
  const docRef = projectFirestore.collection(name).doc(id);
  const [snack, setSnack] = useState(false);

  const handleRemove = () => {
    //remove the game from firestore
    docRef.update({
      list: firebase.firestore.FieldValue.arrayRemove(game),
      total: firebase.firestore.FieldValue.increment(-game.price),
    });
    setSnack(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnack(false);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button color='secondary' size='small' onClick={handleRemove}>Remove</Button>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snack}
        autoHideDuration={2000}
        onClose={handleClose}
        message='Game removed successfully.'
        action={
          <React.Fragment>
            <IconButton size='small' aira-label='close' color='inherit' onClick={handleClose}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
 
export default Remove;