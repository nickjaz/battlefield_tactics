export default class Unit {
  constructor(data = {}) {
    this.name = data.name || "";
    this.faction = data.faction || "";
    this.type = data.type || "";
    this.class = data.class || "";
    this.power = data.power || 0;
    this.base_power = data.base_power || 0;
    this.armor = data.armor || 0;
    this.base_armor = data.base_armor || 0;
    this.initiative = data.initiative || 0;
    this.base_initiative = data.base_initiative || 0;
    this.max_health = data.max_health || 10;
    this.health = data.health || 10;
  }
}
