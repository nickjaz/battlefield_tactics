import React, { Component } from 'react';
import Unit from '../models/unit.js';
import unitList from '../lib/unit_list.js';
import _ from 'lodash';

export default class CombatPlaytest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      units: unitList,
      attacker: new Unit(),
      defender: new Unit(),
      attackerCopy: new Unit(),
      defenderCopy: new Unit(),
      killWins: 0,
      fleeWins: 0,
      attackerWins: 0,
      defenderWins: 0,
      playtestNumber: 1000,
      numberOfTests: 0,
    };
    this.rollDice = this.rollDice.bind(this);
    this.initiativeRoll = this.initiativeRoll.bind(this);
    this.calculateDamage = this.calculateDamage.bind(this);
    this.calculateBreakTest = this.calculateBreakTest.bind(this);
    this.calcuateVictory= this.calcuateVictory.bind(this);
    this.performCombat = this.performCombat.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.playtestBattle = this.playtestBattle.bind(this);
    this.resetPlaytest = this.resetPlaytest.bind(this);
  }

  rollDice(sides) {
    let randomNumber = Math.floor(Math.random() * sides) + 1;
    return randomNumber;
  }

  initiativeRoll(att, def) {
    let aInt = att.initiative + this.rollDice(6);
    let dInt = def.initiative + this.rollDice(6);

    if (aInt === dInt) {
      if ((att.class === 'axe') || (att.class === 'sword' && def.class !== 'spear')) {
        return 'att';
      } else if ((def.class === 'spear') || (def.class === 'sword')) {
        return 'def';
      } else {
        return 'att';
      }
    } else if (aInt > dInt) {
      return 'att';
    } else {
      return 'def';
    }
  }

  calculateDamage(att, def, int) {
    // let dmg = int === 'att' ? (att.power - def.armor) : (def.power - att.armor);
    //
    // if (int === 'att') {
    //   def.health = def.health - dmg;
    //   return def;
    // } else {
    //   att.health = att.health - dmg;
    //   return att;
    // }

    let dmg = 0;

    if (int === 'att') {
      let killTest = 4 + (def.armor - att.power);

      for (let i = 1; i <= att.attacks; i++) {
        console.log('defenders attack number: ', i);
        console.log('kill test: ', killTest);
        let roll = this.rollDice(6);
        dmg = roll >= killTest ? dmg += 1 : dmg;
        console.log('dice roll: ', roll);
        console.log('damage: ', dmg);
      }

      def.health = def.health - dmg;

      if (def.health < 5) {
        def.attacks = def.health;
      }

      return def;

    } else {
      let killTest = 4 + (att.armor - def.power);

      for (let i = 1; i <= def.attacks; i++) {
        console.log('defenders attack number: ', i);
        console.log('kill test: ', killTest);
        let roll = this.rollDice(6);
        dmg = roll >= killTest ? dmg += 1 : dmg;
        console.log('dice roll: ', roll);
        console.log('damage: ', dmg);
      }

      att.health = att.health - dmg;

      if (att.health < 5) {
        att.attacks = att.health;
      }

      return att;
    }
  }

  performCombat() {
    let { attacker, defender } = this.state;
    let def = defender;
    let att = attacker;

    if (this.initiativeRoll(att, def) === 'att') {
      this.calculateDamage(att, def, 'att');

      if (def.health <= 0) {
        def.health = 0;

        this.calcuateVictory('att', 'kill');
        return;
      } else {

        if (def.health <= (def.max_health / 2)) {
          if (this.calculateBreakTest(def)) {
            this.calcuateVictory('att', 'flee');
            return;
          }
        }

        this.calculateDamage(att, def, 'def');

        if (att.health <= 0) {
          att.health = 0;

          this.calcuateVictory('def', 'kill');
          return;
        }

        if (att.health <= (att.max_health / 2)) {
          if (this.calculateBreakTest(att)) {
            this.calcuateVictory('def', 'flee');
            return;
          }
        }

        this.setState({
          attacker: att,
          defender: def
        });
      }
    } else {
      this.calculateDamage(att, def, 'def');

      if (att.health <= 0) {
        att.health = 0;

        this.calcuateVictory('def', 'kill');
        return;
      } else {

        if (att.health <= (att.max_health / 2)) {
          if (this.calculateBreakTest(att)) {
            this.calcuateVictory('def', 'flee');
          }
        }

        this.calculateDamage(att, def, 'att');

        if (def.health <= 0) {
          def.health = 0;

          this.calcuateVictory('att', 'kill');
          return;
        }

        if (def.health <= (def.max_health / 2)) {
          if (this.calculateBreakTest(def)) {
            this.calcuateVictory('att', 'flee');
            return;
          }
        }

        this.setState({
          attacker: att,
          defender: def
        });
      }
    }
  }

  calculateBreakTest(unit) {
    let test = Math.floor((unit.max_health / 2) - unit.health);
    let roll = this.rollDice(6);

    if (test > roll) {
      return true;
    } else {
      return false;
    }
  }

  calcuateVictory(win, type) {
    let {
      attackerWins,
      defenderWins,
      killWins,
      fleeWins,
      attackerCopy,
      defenderCopy
    } = this.state;

    this.setState({
      attacker: _.cloneDeep(attackerCopy),
      defender: _.cloneDeep(defenderCopy)
    });

    if (type === 'kill') {
      this.setState({
        killWins: killWins += 1
      });
    } else if (type === 'flee') {
      this.setState({
        fleeWins: fleeWins += 1
      });
    }

    if (win === 'att') {
      this.setState({
        attackerWins: attackerWins += 1
      });
    } else {
      this.setState({
        defenderWins: defenderWins += 1
      });
    }

    return;
  }

  resetBattle() {
    let {attackerCopy, defenderCopy} = this.state;

    this.setState({
      attacker: _.cloneDeep(attackerCopy) || new Unit(),
      defender: _.cloneDeep(defenderCopy) || new Unit()
    });
  }

  handleChange(e) {
    let key = e.target.name;
    let val = e.target.value;

    this.setState({
      [key]: val
    });
  }

  handleUnitChange(e) {
    let key = e.target.name;
    let val = new Unit(JSON.parse(e.target.value));
    val.power = val.base_power;
    val.armor = val.base_armor;
    val.initiative = val.base_initiative;

    if (key === 'attacker') {
      this.setState({
        attacker: val || new Unit(),
        attackerCopy: _.cloneDeep(val) || new Unit()
      });
    } else {
      this.setState({
        defender: val || new Unit(),
        defenderCopy: _.cloneDeep(val) || new Unit()
      });
    }
  }

  playtestBattle() {
    let {playtestNumber, attacker, defender} = this.state;

    if (attacker.name === '' || defender.name === '') {
      alert('pick a unit');
      return;
    }

    for (let i = 1; i<=playtestNumber; i++) {
      setTimeout(() => {
        this.setState({
          numberOfTests: i
        });
        this.performCombat();
      }, 1000);
    }
  }

  resetPlaytest() {
    this.resetBattle();
    this.setState({
      killWins: 0,
      fleeWins: 0,
      attackerWins: 0,
      defenderWins: 0,
      numberOfTests: 0
    });
  }

  render() {
    let {
      units,
      attacker,
      defender,
      killWins,
      fleeWins,
      attackerWins,
      defenderWins,
      playtestNumber,
      numberOfTests,
    } = this.state;

    let unitOptions = [<option key={-1} value=''>{'Pick a unit'}</option>];
    let attackerCommands = [];
    let defenderCommands = [];

    _.map(units, (u, i) => {
      unitOptions.push(
        <option key={i} value={JSON.stringify(u)}>{u.name}</option>
      );
    });

    return (
      <div className="combat-playtest">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h3>Attacker</h3>
              <div className="form-group">
                <select name="attacker" onChange={this.handleUnitChange}>
                  {unitOptions}
                </select>
              </div>
              <ul>
                <li>Class: {_.upperFirst(attacker.class)}</li>
                <li>Health: {attacker.health}</li>
                <li>Power: {attacker.power}</li>
                <li>Armor: {attacker.armor}</li>
                <li>Initiative: {attacker.initiative}</li>
              </ul>
              <div>
                {attackerCommands}
              </div>
            </div>

            <div className="col-6">
              <h3>Defender</h3>
              <div className="form-group">
                <select name="defender" onChange={this.handleUnitChange}>
                  {unitOptions}
                </select>
              </div>
              <ul>
                <li>Class: {_.upperFirst(defender.class)}</li>
                <li>Health: {defender.health}</li>
                <li>Power: {defender.power}</li>
                <li>Armor: {defender.armor}</li>
                <li>Initiative: {defender.initiative}</li>
              </ul>
              <div>
                {defenderCommands}
              </div>
            </div>
          </div>

          <div className="row">
            <button className="btn btn-primary" onClick={this.performCombat}>Battle</button>
            <button className="btn btn-light" onClick={this.resetBattle}>Reset</button>
          </div>

          <h4 className="results-headline">Playtest results</h4>
          <h6>{'Number of tests: ' + numberOfTests}</h6>



          <div className="row">
            <div className="col-6">
              <h6>{'Kill wins: ' + killWins}</h6>
              {attacker.name !== '' ?
                attacker.name + ': ' + attackerWins
                : ''
              }
            </div>
            <div className="col-6">
              <h6>{'Flee wins: ' + fleeWins}</h6>
              {defender.name !== '' ?
                defender.name + ': ' + defenderWins
                : ''
              }
            </div>
          </div>

          <div className="row">
            <div className="form-group playtest-input">
              <input name="playtestNumber" type="number" min="1" max="10000" value={playtestNumber} onChange={this.handleChange} />
            </div>
            <button className="btn btn-primary" onClick={this.playtestBattle}>Playtest</button>
            <button className="btn btn-light" onClick={this.resetPlaytest}>Reset results</button>
          </div>
        </div>
      </div>
    );
  }
}
