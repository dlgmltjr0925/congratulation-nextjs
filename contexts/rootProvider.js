import { CookiesProvider } from 'react-cookie';
import { UserProvider } from './userContext';

const RootProvider = ({ children }) => {
  return (
    <CookiesProvider>
      <UserProvider>{children}</UserProvider>
    </CookiesProvider>
  );
};

export default RootProvider;
