import React, { Component } from 'react';
import Nav from './nav.js';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <header className="App-header container">
          <h2>Battlefield tactics</h2>
          <Nav />
        </header>
      </div>
    );
  }
}
