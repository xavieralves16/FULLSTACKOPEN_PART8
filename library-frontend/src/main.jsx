import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider } from '@apollo/client/react'   

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : null } }
})
const client = new ApolloClient({ link: from([authLink, httpLink]), cache: new InMemoryCache() })

const root = createRoot(document.getElementById('root'))  
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)