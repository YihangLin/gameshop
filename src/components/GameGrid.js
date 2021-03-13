import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import useFirestore from '../hooks/useFirestoreGames';
import { Grid, Card, CardMedia, CardContent, Typography, Button, CardActionArea, CardActions, Divider } from '@material-ui/core';
import AddCart from './AddCart';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginTop: 15,
    marginBottom: 10,
  },
  card_buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  media: {
    paddingTop: '56.25%',
  },
  card_background: {
    backgroundColor: '#e8eaf6',
  },
}));

const GameGrid = () => {
  const classes = useStyles();
  const { docs } = useFirestore('games');
  let history = useHistory();

  const handleClick = (id) => {
    history.push('/game/' + id);
  }

  return (
    <div className={classes.root}>
      <Divider />
      <Typography className={classes.title} gutterBottom align='left' variant='h5' color='primary'>
        Featured Games
      </Typography>
      <Grid container spacing={3}>
        {/* list all the games */}
        { docs && docs.map((doc) => (
          <Grid item xs={12} sm={3} key={doc.id}>
            <Card variant='outlined'>
              <CardActionArea onClick={() => handleClick(doc.id)}>
                <CardMedia className={classes.media}
                  image={doc.img}
                  title={doc.name}
                />
                <CardContent className={classes.card_background}>
                  <Typography gutterBottom variant='h6' noWrap title={doc.name}>
                    {doc.name}
                  </Typography>
                  <Typography variant='h6' color='primary' align='right'>
                    ${doc.price / 100}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.card_buttons}>
                <Button size='small' color='primary' onClick={() => handleClick(doc.id)}>
                  Learn More
                </Button>
                
                <AddCart game={doc} name='Add' id={doc.id}/>
              </CardActions>
            </Card>
          </Grid>
          
        ))}
      </Grid>
    </div>
  )
}
 
export default GameGrid;