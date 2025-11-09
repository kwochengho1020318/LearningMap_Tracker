function checkSession(req, res, next) {
  if (req.path === '/login'||req.path==='/login/status'||req.path==='/login/logout') {
    return next();
  }

  // 檢查 session
  if (req.session && req.session.User_ID) {
    next(); // 已登入，放行
  } else {
    res.status(401).send({ message: 'UnAuthorized' });
    return;
  }
}

module.exports = checkSession;