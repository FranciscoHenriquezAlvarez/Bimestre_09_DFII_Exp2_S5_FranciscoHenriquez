import React from 'react';
import ReactDOM from 'react-dom/client';

import { ApolloProvider } from '@apollo/client/react';

import App from './App.jsx';
import client from './graphql/client.js';

import './index.css';

async function iniciarAplicacion() {
  // Activar MSW solamente durante el desarrollo.
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.js');

    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
}

iniciarAplicacion();