import React from 'react';
import ReactDOM from 'react-dom';
import "../node_modules/grommet-css";

import Quiz from './Quiz';




import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Quiz />, document.getElementById('root'));
registerServiceWorker();
