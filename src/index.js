import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker'
import KanbanBoardContainer from './KanbanBoardContainer';
import './index.css';

ReactDOM.render(<KanbanBoardContainer />, document.getElementById('root'));
registerServiceWorker();
