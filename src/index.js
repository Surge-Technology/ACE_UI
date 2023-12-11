import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import "rc-pagination/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
