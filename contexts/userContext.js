import React, { useContext, useEffect } from "react";

import { useImmer } from "use-immer";

const initialUser = {
  isLoggedIn: false,
  accessToken: "",
};

const initialUserContextValue = {
  user: initialUser,
};

const UserContext = React.createContext();

export const UserProvider = ({ children, accessToken }) => {
  const [user, setUser] = useImmer(
    accessToken ? { isLoggedIn: true, accessToken } : initialUser
  );

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
