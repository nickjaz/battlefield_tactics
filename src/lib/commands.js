export const tightFormation = function(unit, att) {
  if (unit.class === 'spear' && !att) {
    return unit.armor += 1;
  } else {
    return;
  };
};
