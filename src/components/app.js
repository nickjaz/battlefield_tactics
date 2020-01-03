import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Header from './header.js';
import CombatPlaytest from './combat_playtest.js';
import TerrainPlaytest from './terrain_playtest.js';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <BrowserRouter>
        <div className="battlefieldTactics">
          <main>
            <Route exact path="*" component={Header} />
            <Route exact path="/" render={() => <Redirect from="/" to="/combat" />} />
            <Route exact path="/combat" component={CombatPlaytest} />
            <Route exact path="/terrain" component={TerrainPlaytest} />
          </main>
        </div>
      </BrowserRouter>

    );
  }
}
