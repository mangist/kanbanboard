import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

class List extends Component {

  render() {
    var cards = this.props.cards.map((card) => {
      return <Card key={card.id} 
                   {...card}
                   taskCallbacks={this.props.taskCallbacks} />
    });

    return (
      <div className="list">
        <h1>{this.props.title}</h1>
        {cards}
      </div>
    )
  }
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
}

export default List
