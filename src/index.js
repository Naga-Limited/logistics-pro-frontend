import 'react-app-polyfill/stable'
import 'core-js'

// Suppress ResizeObserver loop limit exceeded error overlay
window.addEventListener('error', e => {
  if (e.message && (e.message.includes('ResizeObserver') || e.message.includes('ResizeObserver loop'))) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

window.addEventListener('unhandledrejection', e => {
  if (e.reason && e.reason.message && (e.reason.message.includes('ResizeObserver') || e.reason.message.includes('ResizeObserver loop'))) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
serviceWorker.register()
