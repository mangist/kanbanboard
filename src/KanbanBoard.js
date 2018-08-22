import React, { Component } from 'react';
import List from './List';

class KanbanBoard extends Component {

  render() {
    return (
      <div className="app">
        <List key='todo' title="To Do" taskCallbacks={this.props.taskCallbacks} cards={
          this.props.cards.filter((card) => card.status === "todo")
        } />

        <List key='in-progress' title="In Progress" taskCallbacks={this.props.taskCallbacks} cards={
          this.props.cards.filter((card) => card.status === "in-progress")
        } />

        <List key='done' title="Done" taskCallbacks={this.props.taskCallbacks} cards={
          this.props.cards.filter((card) => card.status === "done")
        } />

      </div>
    )
  }
}

export default KanbanBoard;
