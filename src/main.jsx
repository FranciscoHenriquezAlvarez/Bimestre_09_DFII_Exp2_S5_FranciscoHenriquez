import React from 'react';
import ReactDOM from 'react-dom/client';

import { ApolloProvider } from '@apollo/client/react';

import App from './App.jsx';
import client from './graphql/client.js';

import './index.css';

async function iniciarAplicacion() {
  // Activar MSW en desarrollo y en la versión publicada de MundoViajes.
  const { worker } = await import('./mocks/browser.js');

  await worker.start({
    onUnhandledRequest: 'bypass',

    // Utilizar la ruta base configurada en Vite.
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      options: {
        scope: import.meta.env.BASE_URL,
      },
    },
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
}

iniciarAplicacion();