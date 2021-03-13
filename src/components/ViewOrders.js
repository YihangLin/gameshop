import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Container, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import useFirestoreOrders from '../hooks/useFirestoreOrders';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '80vh',
  },
  img: {
    maxWidth: '60%',
    maxHeight: '60%',
  },
  cart: {
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    flexBasis: '70%',
  },
  details: {
    flexDirection: 'column',
  },
  grid_border: {
    backgroundColor: '#dcedc8',
  }
}))

const ViewOrders = () => {
  let { id } = useParams();
  const classes = useStyles();
  const [ docs ] = useFirestoreOrders(id);

  return (
    <Container maxWidth='md' className={classes.root}>
      <h1 className={classes.cart}>Orders: </h1>
      {docs && docs.map((doc, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>Order#: {doc.order}</Typography>
              <Typography>Time: {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(doc.time)}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            {doc.games.map((game, gameIndex) => (
              <Grid container spacing={2} key={gameIndex} alignItems='center' justify='center' className={classes.grid_border}>
                <Grid item xs={12} sm={4}>
                  <img className={classes.img} src={game.img} alt={game.name}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography align='center' variant='subtitle1' noWrap title={game.name}>
                    {game.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography align='center' variant='body2'>
                    ${game.price / 100}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
 
export default ViewOrders;