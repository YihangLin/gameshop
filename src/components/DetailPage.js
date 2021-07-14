import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Button, Divider, Chip, Collapse, Backdrop, CircularProgress } from '@material-ui/core';
import { projectFirestore } from '../firebase/config';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import AddCart from './AddCart';
import AddWishlist from './AddWishlist';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 25,
  },
  description: {
    backgroundColor: '#e8eaf6',
  },
  divider: {
    marginTop: 25,
    marginBottom: 25,
  },
  image: {
    maxWidth: '100%',
  },
  about: {
    whiteSpace: 'pre-wrap',
  },
  buttonSection: {
    marginTop: 5,
  },
  chips: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#2196f3',
  },
  show: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#e0e0e0',
  },
}));

const Detail = () => {
  let { id } = useParams();
  const [info, setInfo] = useState({});
  const [about, setAbout] = useState('');
  const [tags, setTags] = useState([]);
  const [checked, setChecked] = useState(false);
  const classes = useStyles();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    //get the game info from firestore
    const gameInfo = projectFirestore.collection('games').doc(id);
    gameInfo.get().then((doc) => {
      if (doc.exists){
        setInfo({...doc.data(), id: id});
        setAbout((doc.data().about).replaceAll('\\n', '\n'));
        setTags(doc.data().tags);
        setIsPending(false);
        setError(null);
      }else{
        console.log('No such data');
        setError('Error, game does not exist!');
        setIsPending(false);
      }
    })
  }, [id]);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div>
      { error && <h1>{error}</h1> }

      { !error && <Container>
        <div className={classes.root}> 
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <img className={classes.image} src={info.img} alt=''/>
            </Grid>
            <Grid container item xs ={12} sm={6}>
              <Grid item xs={12}>
                <Typography variant='h5' gutterBottom>
                  {info.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='caption' gutterBottom>
                  {info.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {tags && tags.map((tag, index) => (
                  <Chip className={classes.chips} size='small' color='primary' label={tag} key={index}/>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6'>
                  ${info.price / 100}
                </Typography>
              </Grid>

              <Grid container item xs={12} sm={6} className={classes.buttonSection}>
                <Grid item xs={6}>
                  <AddWishlist name='Wishlist' game={info}/>
                </Grid>
                <Grid item xs={6}>
                  <AddCart name='add to cart' game={info}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <Divider className={classes.divider} />

        <Typography variant='h6' align='left' gutterBottom>
          ABOUT THE GAME
        </Typography>
        
        <Collapse in={checked} collapsedHeight={300}>
          <Typography className={classes.about} variant='body2' align='left'>
            {about}
          </Typography>
        </Collapse>

        <div className={classes.show} >
          {checked ? <Button onClick={handleChange} color='primary' size='medium' startIcon={<ExpandLessOutlinedIcon />}>SHOW LESS</Button> : <Button onClick={handleChange} color='primary' size='medium' startIcon={<ExpandMoreOutlinedIcon />}>SHOW MORE</Button>}
        </div>
      </Container> }
      <Backdrop className={classes.backdrop} open={isPending}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
}
 
export default Detail;