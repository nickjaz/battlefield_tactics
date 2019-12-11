import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import App from './components/app.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
