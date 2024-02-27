import App from './shared/components/app/App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './redux/store';
import persistor from './redux/store';
import persistStore from "redux-persist/es/persistStore";
import Spinner from './shared/components/Spinner/Spinner';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import './index.css';
import "./styles/index.scss"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Spinner />} persistor={persistStore(persistor)}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
)
