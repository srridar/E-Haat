const isTransporter = (req, res, next) => {
    if (req.user.role !== "transporter") {
        return res.status(403).json({
            message: "Transporter access only",
            success: false,
        });
    }
    next();
};

export default isTransporter