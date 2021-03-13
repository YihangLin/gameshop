import React from 'react';
import { useParams } from 'react-router-dom';
import useFirestore from '../hooks/useFirestoreCount';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Container, Button } from '@material-ui/core';
import AddCart from './AddCart';
import Remove from './Remove';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';

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

const Wishlist = () => {
  let { id } = useParams();
  const classes = useStyles();
  const [ docs ] = useFirestore('wishlists', id);

  return (
    <Container maxWidth='md' className={classes.root}>
      <FavoriteIcon color='primary' fontSize='large' className={classes.cart} />
        {/* list games in wishlist */}
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
            <Grid container item xs={12} sm={3} direction='column' alignItems='center' justify='center'>
              <Grid item xs={12}>
                <AddCart name='add to cart' game={doc}/>
              </Grid>
              <Grid item xs={12}>
                <Remove name='wishlists' id={id} game={doc} />
              </Grid>
            </Grid>
          </Grid>
        ))}
    </Container>
  );
}
 
export default Wishlist;