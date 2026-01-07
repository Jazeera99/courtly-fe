import React from 'react';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/', 
});

const authLink = setContext((_, { headers }) => {
  // const userJson = localStorage.getItem('user');
  
  // if (!userJson) {
  //   console.warn("DEBUG: Tidak ada data 'user' di localStorage!");
  //   return { headers };
  // }

  // Ambil data user
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // CARA AMBIL TOKEN (Cek di dalam objek user ATAU cek kunci 'token' langsung)
  const token = user?.token || localStorage.getItem('token');

  console.log("Token yang dikirim ke server:", token ? "Ada (Terdeteksi)" : "KOSONG/Undefined");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const ApolloAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

export default apolloClient;