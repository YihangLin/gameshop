import React, { useEffect, useState, createContext } from 'react';
import { projectAuth } from '../firebase/config';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    projectAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
  });

  return (
    <AuthContext.Provider value={{currentUser, isLoading}}>
      {props.children}
    </AuthContext.Provider>
  );
}
 
export default AuthContextProvider;