import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from "apollo-link-context"
import { getToken } from "./components/manage-tokens";

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

const httpLink = new HttpLink({ uri: "http://localhost/graphql/" })
const authLink = setContext(async (req, { headers }) => {
  const token = getToken();
  return {
    ...headers,
    headers: {
      Authorization: token !== "" ? `jwt ${token}` : null
    }
  }
})

const link = authLink.concat(httpLink as any)
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

