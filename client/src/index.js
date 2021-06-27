import React from "react";
import './index.css';
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {Router, Route, Switch, Redirect } from "react-router-dom";
import DataProvider from './redux/store'
import indexRoutes from "routes/index.jsx";
import * as serviceWorker from './serviceWorker';
import "assets/scss/material-dashboard-pro-react.css?v=1.3.0";
import App from './App';
const hist = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
