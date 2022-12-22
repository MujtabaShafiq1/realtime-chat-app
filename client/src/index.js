import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SocketProvider } from './context/Socket';
import { ThemeContextProvider } from "./context/ThemeProvider"

import store from "./store/index"
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <SocketProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </SocketProvider>
    </Provider>
  </BrowserRouter>
);
