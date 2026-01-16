 const isBuyer = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({
      message: "Buyer access only",
      success: false,
    });
  }
  next();
};

export default isBuyer