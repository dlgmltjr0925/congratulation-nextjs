import React, { useContext, useEffect } from 'react';

import { useImmer } from 'use-immer';

const initialUser = {
  isLoggedIn: false,
  accessToken: '',
};

const initialUserContextValue = {
  user: initialUser,
};

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  console.log('UserProvider');
  const [user, setUser] = useImmer(initialUser);

  const signin = () => {
    console.log(signin);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signin }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
