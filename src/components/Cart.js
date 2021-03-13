import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useFirestore from '../hooks/useFirestoreCount';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Container, Button } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link } from 'react-router-dom';
import Remove from './Remove';
import { projectFirestore } from '../firebase/config';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '80vh',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  cart: {
    marginTop: 15,
    marginBottom: 10,
  },
}))

const Cart = () => {
  let history = useHistory();
  let { id } = useParams();
  const classes = useStyles();
  const [ docs, total ] = useFirestore('carts', id);
  const [btn, setBtn] = useState(false);
  const stripeCollectionRef = projectFirestore.collection('stripe');

  useEffect(() => {
     if (total === 0){
      setBtn(true);
    } else {
      setBtn(false);
    }
  }, [total]);

  const handleCheckout = () => {
    stripeCollectionRef.add({
      total: total,
      uid: id,
      paid: false,
    })
    .then((docRef) => {
      console.log('Stripe Document successfully created!');
      //redirect after payment
      history.push({ 
        pathname: '/checkout/' + id + '/' + docRef.id, 
        state: {
          price: {total},
          games: {docs},
        },
      });
    })
    .catch((error) => {
      console.log('Error creating stripe document: ', error);
    });
  }


  return (
    <Container maxWidth='md' className={classes.root}>
      <ShoppingCartIcon className={classes.cart} fontSize='large' color='primary'/>
        {/* list all the games in cart */}
        {docs && docs.map((doc, index) => (
          <Grid container spacing={2} key={index} alignItems='center' justify='center'>
            <Grid item xs={12} sm={3}>
              <img className={classes.img} src={doc.img} alt={doc.name}/>
            </Grid>
            <Grid container item sm={3} direction='column' alignItems='center' justify='center'>
              <Grid item xs={12}>
                <Typography variant='subtitle1' noWrap title={doc.name}>
                  {doc.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button size='small' color='primary' component ={ Link } to={'/game/' + doc.id}>View Detail</Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='subtitle1' align='center'>
                ${doc.price / 100}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Remove name='carts' id={id} game={doc}/>
            </Grid>
          </Grid>
        ))}

        <Grid container spacing={2} alignItems='center' className={classes.cart}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' color='primary'>
              Total: 
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant='h5' color='primary' align='center'>
              ${total / 100}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3} align='center'>
            <Button color='primary' size='small' variant='contained' disabled={btn} onClick={handleCheckout}>checkout</Button>
          </Grid>
        </Grid>
    </Container>
  );
}
 
export default Cart;