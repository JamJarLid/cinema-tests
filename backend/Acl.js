module.exports = class Acl {

  // Here you can implement ACL
  // return true = allowed, false = forbidden

  // req.sesssion.user -> logged in user if any

  static checkRoute(req, table, method, isTable, isView) {
    let role = req.session.user ?
      (req.session.user.role || 'logged in') :
      'not logged in';
    
    console.log([
      'role ' + role,
      'user ' + JSON.stringify(req.session.user, '', ' '),
      'url ' + req.url,
      'table ' + table,
      'method' + method,
      'isTable ' + isTable,
      'isView ' + isView
    ].join('\n'))

    if (role === 'not logged in' && table === 'users' && method === 'POST') { 
      return true;
    }

    if (role === 'not logged in' && method !== 'GET') {
      return false
    }

    if (role !== 'admin' && table === 'users') {
      return false
    }

    return true
  }

}