import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';

import { AppRouter } from '@/router/app-router';
import { setupStore } from '@/store';

const store = setupStore();

export const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer transition={Slide} />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
