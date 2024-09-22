function hasPermission(permisosRole, permiso, options) {
  if (permisosRole && permisosRole.includes(permiso)) {
    return options.fn(this);
  }
  return options.inverse(this);
}

module.exports = { hasPermission };