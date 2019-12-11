import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link className="nav-link" to="/combat">
              Combat
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/terrain">
              Terrain
          </Link>
        </li>
      </ul>
    );
  }
}

export default withRouter(Nav);
