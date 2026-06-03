const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists on request and if their role is in the allowed roles array
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res
        .status(403)
        .json({
          error: "Forbidden: Insufficient permissions to access this resource",
        });
    }
    next();
  };
};

module.exports = { restrictTo };
