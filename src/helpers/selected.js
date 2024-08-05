function isSelected(selectedId, currentId){
  return selectedId.toString() === currentId.toString();
}

module.exports = { isSelected };