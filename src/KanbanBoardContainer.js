import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import update from 'immutability-helper';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
 'Content-Type': 'application/json',
 Authorization: '{68F5C91C-6571-4012-8BDE-EA53A7A5CE86}'// The Authorization is not needed for local server
};

class KanbanBoardContainer extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      cards:[]
    };
  }

  // Fetches the card data from the external API and sets the state of the component
  componentDidMount(){
    fetch(API_URL + "/cards", { headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({cards: responseData});

      console.log(responseData);
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  addTask(cardId, taskName){

    // Keep a reference to the previous state incase of error
    let prevState = this.state;

    // Find the index of the card
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

    // Create a new task with the name and a temporary ID
    let newTask = { id:Date.now(), name:taskName, done:false};

    // Create a new object and push the new task to the array of tasks
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { $push: [newTask]}
      }
    });

    // Set the component state to the new state
    this.setState({cards:nextState});

    // Call the API to add the task to this card
    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => {
      if (!response.ok)
      {
        throw new Error('Server response was not ok');
      }
      else 
      {
        return response.json();
      }})
    .then((responseData) => {
      newTask.id = responseData.id;
      this.setState({cards:nextState});
    })
    .catch((error) =>
    {
      alert(error);
      this.setState(prevState);
    })
  }

  deleteTask(cardId, taskId, taskIndex){
    // Find this card
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
    console.log('Deleting task at cardIndex:' + cardIndex + ' with cardId:' + cardId);

    // Keep previous state
    let prevState = this.state;

    // Create a new object without this card
    let nextState = update(this.state.cards, {
                        [cardIndex]: { tasks: {$splice: [[taskIndex,1]] } 
                      } 
                    });

    // Set the component state to the mutated state
    this.setState({cards: nextState});

    // Call the API to remove the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    })
    .then((response) => {
      if (!response.ok)
      {
        throw new Error('Server response was not ok');
      }
    })
    .catch((error) =>
    {
      alert(error);
      this.setState(prevState);
    });
   }

  toggleTask(cardId, taskId, taskIndex){
    // Find the index of this card
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

    // Keep previous state
    let prevState = this.state;

    // Save a reference to the task's done value
    let newDoneValue;

    // Using the $apply command, change the done value to its opposite
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { 
          [taskIndex]: {
            done: { $apply: (done) => {
                newDoneValue = !done;
                return newDoneValue;
              }
            }
          }
        }
      }
    });

    // Set the component state
    this.setState({cards: nextState});

    // Call the API to toggle the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({done:newDoneValue})
    })
    .then((response) => {
      if (!response.ok)
      {
        throw new Error('Server response was no ok');
      }
    })
    .catch((error) => {
      alert(error);
      this.setState(prevState);
    });
  }

  render(){
    return <KanbanBoard cards={this.state.cards}
                        taskCallbacks={
                          {
                            toggle: this.toggleTask.bind(this),
                            delete: this.deleteTask.bind(this),
                            add: this.addTask.bind(this)
                          }
                        } />
  }
}

export default KanbanBoardContainer;