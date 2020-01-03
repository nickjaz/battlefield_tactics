import React, { Component } from 'react';
// import TerrainCard from './terrain_card.js';
import _ from 'lodash';
import terrainList from '../lib/terrain_list';

export default class TerrainPlaytest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terrainArr: []
    };

    this.rollDice = this.rollDice.bind(this);
    this.generateTerrain = this.generateTerrain.bind(this);
  }

  componentDidMount() {
    _.times(26, () =>{
      this.generateTerrain();
    });
  }

  rollDice(sides) {
    let randomNumber = Math.floor(Math.random() * sides) + 1;
    return randomNumber;
  }

  generateTerrain() {
    let roll = (this.rollDice(6) + this.rollDice(6)) - 2;
    let {terrainArr} = this.state;
    let terrainIdx = terrainList[roll];

    terrainArr.push(terrainIdx);
    this.setState({
      terrainArr
    });
  }

  render() {
    let {terrainArr} = this.state;
    let rowOne = [];
    let rowTwo = [];
    let rowThree = [];
    let rowFour = [];
    let rowFive = [];

    _.map(terrainArr, (t, i) => {
      if (i<=3) {
        rowOne.push(<div className="col-2">{t.type || ''}</div>);
      } else if (i>=4 && i<=9) {
        rowTwo.push(<div className="col-2">{t.type || ''}</div>);
      } else if (i>=10 && i<=15) {
        rowThree.push(<div className="col-2">{t.type|| ''}</div>);
      } else if (i>=16 && i<=21) {
        rowFour.push(<div className="col-2">{t.type|| ''}</div>);
      } else if (i>=22) {
        rowFive.push(<div className="col-2">{t.type || ''}</div>);
      }
    });

    return (
      <div className="terrain-playtest">
        <div className="container map-container">
          <div className="row">
            <div className="col-2"></div>
            {rowOne}
            <div className="col-2"></div>
          </div>
          <div className="row">
            {rowTwo}
          </div>
          <div className="row">
            {rowThree}
          </div>
          <div className="row">
            {rowFour}
          </div>
          <div className="row">
            <div className="col-2"></div>
            {rowFive}
            <div className="col-2"></div>
          </div>
        </div>
      </div>
    );
  }
}
