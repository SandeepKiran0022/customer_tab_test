import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
