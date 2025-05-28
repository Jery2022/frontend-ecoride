export const getSession = async (req, res) => {
    if (req.session && req.session.userName) {
        res.json({
            userName: req.session.userName,
            userRole: req.session.userRole,
            userIsValid: req.session.userIsValid,
            isAdmin: req.session.userRole === 1,  
            isEmploye: req.session.userRole === 2
        });
    } else {
        res.status(401).json({ message: 'Non authentifié' }); 
    }
}; 