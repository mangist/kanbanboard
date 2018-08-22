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

  }

  deleteTask(cardId, taskId, taskIndex){
    // Find this card
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
    console.log('Deleting task at cardIndex:' + cardIndex + ' with cardId:' + cardId);

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
    });
  }

  toggleTask(cardId, taskId, taskIndex){

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