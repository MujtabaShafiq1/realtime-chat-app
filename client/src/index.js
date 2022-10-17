import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { SocketProvider } from './context/Socket';

import store from "./store/index"
import theme from "./theme/theme"
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider theme={theme}>
          {/* <React.StrictMode> */}
          <App />
          {/* </React.StrictMode> */}
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  </BrowserRouter>
);
