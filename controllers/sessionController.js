export const getSession = async (req, res) => {
    if (req.session && req.session.userName) {
        res.json({
            userName: req.session.userName,
            userRole: req.session.userRole,
            userIsValid: req.session.userIsValid,
            isAuthenticated: true,
        });
    } else {
        res.json({ isAuthenticated: false });
    }
}; 