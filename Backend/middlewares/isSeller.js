 const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: "Buyer access only",
      success: false,
    });
  }
  next();
};

export default isSeller