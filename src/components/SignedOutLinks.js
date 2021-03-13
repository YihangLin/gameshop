import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const SignedOutLinks = () => {
  return (
    <div>
      <Button component={ Link } to='/login' color='inherit'>Login</Button>
      <Button component={ Link } to='/signup' color='inherit'>Signup</Button>
    </div>
  );
}
 
export default SignedOutLinks;