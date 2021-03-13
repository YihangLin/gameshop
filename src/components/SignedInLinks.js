import React, { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import { Button, Badge, IconButton } from '@material-ui/core';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import useFirestore from '../hooks/useFirestoreCount';
import HistoryIcon from '@material-ui/icons/History';
// import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cartColor: {
    color: '#ffffff',
  },
  snackColor: {
    backgroundColor: '#ccff90',
  },
}));

const SignedInLinks = ({id}) => {
  const classes = useStyles();
  // const { docs, exist } = useFirestore('carts', id);
  const [ cartDocs ] = useFirestore('carts', id);
  const [ wishlistDocs ] = useFirestore('wishlists', id);
  const [numCart, setNumCart] = useState(0);
  const [numWishlist, setNumWishlist] = useState(0);
  
  useEffect(() => {
    //get the number of games in cart and wishlist
    setNumCart(cartDocs.length);
    setNumWishlist(wishlistDocs.length);
  }, [cartDocs, wishlistDocs]);

  const logout =() => {
    projectAuth.signOut().then(() => {
      console.log('Logged out');
    })
  }

  return (
    <div className={classes.links}>
      <IconButton aria-label='orders' className={classes.cartColor} component={ Link } to={'/orders/' + id}>
        <HistoryIcon />
      </IconButton>
      <IconButton aria-label='wish' className={classes.cartColor} component={ Link } to={'/wishlist/' + id}>
        <Badge badgeContent={numWishlist} color='error' className={classes.icon}>
          <FavoriteBorderIcon />
        </Badge>
      </IconButton>
      <IconButton aria-label='cart' className={classes.cartColor} component={ Link } to={'/cart/' + id}>
        <Badge badgeContent={numCart} color='error' className={classes.icon}>
          <LocalMallOutlinedIcon />
        </Badge>
      </IconButton>
      <Button color='inherit' onClick={logout}>Logout</Button>
      
    </div>
  );
}
 
export default SignedInLinks;