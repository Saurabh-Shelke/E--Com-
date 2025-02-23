import { createContext, useState, useEffect } from 'react';

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

    const saveAuthToken = (token) => {
        if (typeof token === 'string') {
            setAuthToken(token);
            localStorage.setItem('authToken', token);
            console.log('Token saved to localStorage:', localStorage.getItem('authToken')); // Verify it's saved

        } else {
            console.error('Auth token must be a string');
        }
    };

    const clearAuthToken = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
    };

    return (
        <Context.Provider value={{ authToken, saveAuthToken, clearAuthToken }}>
            {children}
        </Context.Provider>
    );
};

export default Context;
