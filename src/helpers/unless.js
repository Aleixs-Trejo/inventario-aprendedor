function unless(condition, options){
  if (!condition) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

module.exports = unless;