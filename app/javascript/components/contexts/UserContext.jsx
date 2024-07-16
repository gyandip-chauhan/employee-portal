import { createContext, useContext } from 'react';

export const UserContext = createContext({ currentUser: {} });

export const UserProvider = () => useContext(UserContext);
