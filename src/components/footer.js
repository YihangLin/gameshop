import React from 'react';
import { Divider, Avatar, Typography } from '@material-ui/core';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  footer: {
    marginTop: 5,
    marginBottom: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Divider />
      <div className={classes.footer}>
        <Avatar className={classes.logo}>
          <SportsEsportsIcon />
        </Avatar>
        <Typography>
        © 2020 Games. All rights reserved.
        </Typography>
      </div>
      <Divider />
    </div>
  );
}
 
export default Footer;