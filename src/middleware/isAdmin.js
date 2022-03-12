
const db = require("../models");
const InforUser = db.inforuser;


const isAdmin = (req, res, next) => {
    if (!req.session.User || req.session.User.role != 0) 
        return res.redirect("/login");
    next()
}

const isDoctor = (req, res, next) => {
    if (!req.session.User || (req.session.User.role != 0 && req.session.User.role != 1))
        return res.redirect("/login");
    next()
}

const isUser = async (req, res, next) => {
    if (!req.session.User)
        return res.redirect("/login");
    if (!req.session.User.infor)
        return res.redirect("/checkinfor");
    next()
}

module.exports = {
    isAdmin,
    isDoctor,
    isUser
  };
  