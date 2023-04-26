module.exports = class Acl {

  // Here you can implement ACL
  // return true = allowed, false = forbidden

  // req.session.user -> logged in user if any

  static checkRoute(req, table, method, isTable, isView) {
    let role = req.session.user ?
      (req.session.user.userRole || 'logged in') :
      'not logged in';

    let allowedRoles = ['not logged in', 'logged in', 'admin'];
    if (!allowedRoles.includes(role)) { role = 'not logged in'; }

    method = method.toUpperCase();

    console.log([
      'role ' + role,
      'user ' + JSON.stringify(req.session.user, '', ' '),
      'url ' + req.url,
      'table ' + table,
      'method ' + method,
      'isTable ' + isTable,
      'isView ' + isView,
      '--------------------------------------'
    ].join('\n'));

    // Admin gets full access
    if (role === 'admin') {
      return true;
    }

    // GET tables and views available for all
    if (table === 'tables_and_views' && method === 'GET') {
      return true;
    }
    else {
      console.log("NO IT WASNT", table, method)
    }

    // Tables that are available to be viewed by everyone
    if (['movies', 'screenings', 'movies_by_categories'].includes(table) && method === 'GET') {
      return true;
    }

    // Not logged in can log in
    if (role === 'not logged in' && table === 'login' && method === 'POST') {
      return true;
    }

    // Not logged in can create user
    if (role === 'not logged in' && table === 'users' && method === 'POST') {
      return true;
    }

    // Logged in user can see their own bookings
    if (role === 'logged in' && table === 'bookings' && method === 'GET'
         /* && req.session.user.id === booking.user or something*/) {
      return true;
    }

    //Logged in user can book tickets and seats
    if (role === 'logged in' && ['bookings', 'bookingsXseats'].includes(table) && method === 'POST') {
      return true
    }

    return false;
  }

}