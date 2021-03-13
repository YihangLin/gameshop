import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Avatar } from '@material-ui/core';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
    backgroundColor: '#ffffff',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Avatar className={classes.logo} component={ Link } to='/'>
            <SportsEsportsIcon color='primary' />
          </Avatar>
          <Typography varaiant='h6' className={classes.title}>
            Games
          </Typography>
          {currentUser ? <SignedInLinks id={currentUser.uid}/> : <SignedOutLinks/>}
        </Toolbar>
      </AppBar>
    </div>
  );
}
 
export default Navbar;