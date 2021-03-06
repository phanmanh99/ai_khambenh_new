const path = require("path");
const db = require("../models");
const spawn = require("await-spawn");
const { array } = require("../middleware/upload");
const md5 = require("md5");
const config = require("../config/config");
const axios = require("axios");
const console = require("console");
const { count } = require("console");
const { account } = require("../models");

const Account = db.account
const Image = db.image;
const ChiTietKham = db.chitietkham;
const InforDoctor = db.infordoctor;
const InforUser = db.inforuser;
const KhamBenh = db.khambenh
const Messengers = db.messenger;

// ===============================================
// ================ ADMIN ========================
// ===============================================
const home = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/admin/admin`));
};
const getAdminLogin = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/admin/login`));
};
const postAdminLogin = async (req, res) => {
    // console.log(req);
    const users = await Admins.findAll({
        where: { username: req.body.username },
    });

    if (users.length)
        if (users[0].password == md5(req.body.password)) {
            req.session.User = {
                username: users[0].username,
                role: users[0].role,
            };
            if (users[0].role == 1) return res.redirect("/admin");
            else if (users[0].role == 2) return res.redirect("/doctor");
        }
    return res.render(path.join(`${__dirname}/../views/admin/login`), {
        err_msg: "Tài khoản hoặc mật khẩu không đúng",
    });
};
const getAdminRegister = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/admin/register`));
};
const postAdminRegister = async (req, res) => {
    await Admins.create({
        username: req.body.username,
        password: md5(req.body.password),
        role: 2,
    });
    return res.redirect("/admin/login");
};
const formUser = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/admin/formUser`));
};
const postFormUser = async (req, res) => {
    console.log(req.body["val-username"]);
    await Account.create({
        username: req.body["val-username"],
        password: md5(req.body["val-password"]),
        role: 2
    });
    await InforUser.create({
        username: req.body["val-username"],
        hoten: req.body["val-hoten"],
        diachi: req.body["val-diachi"],
        cmnd: req.body["val-cmnd"],
        sdt: req.body["val-sdt"],
        email: req.body["val-email"],
        sobhyt: req.body["val-bhyt"],
        tiensubenh: req.body["val-tsbl"],
    });
    return res.render(path.join(`${__dirname}/../views/admin/formUser`), {
        err_msg: "Đã tạo tài khoản",
    });
};
const tableUser = async (req, res) => {
    const data = await Account.findAll({
        where: { role: 2 },
    });
    return res.render(path.join(`${__dirname}/../views/admin/tableUser`), {
        datas: data,
    });
};
const deleteUser = async (req, res) => {
    await Account.destroy({
        where: { username: req.params.username },
    });
    return res.redirect("back");
};
const formDoctor = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/admin/formDoctor`));
};
const postFormDoctor = async (req, res) => {
    await Account.create({
        username: req.body["val-username"],
        password: md5(req.body["val-password"]),
        role: 1,
    });
    await InforDoctor.create({
        username: req.body["val-username"],
        hoten: req.body["val-hoten"],
        namkn: req.body["val-nkn"],
        email: req.body["val-email"]
    });
    return res.render(path.join(`${__dirname}/../views/admin/formDoctor`));
};
const tableDoctor = async (req, res) => {
    const data = await Account.findAll({
        where: { role: 1 },
    });
    return res.render(path.join(`${__dirname}/../views/admin/tableDoctor`), {
        datas: data,
    });
};
const deleteDoctor = async (req, res) => {
    await Account.destroy({
        where: { username: req.params.username },
    });
    return res.redirect("back");
};
const traning = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/admin/traning`));
};
const postTraning = async (req, res) => {
    try {
        const python = await spawn(config.cmdPython, [config.aiHuanLuyen]);
    } catch (e) {
        console.log(e.stderr.toString());
    }
    return res.redirect(`back`);
};
const traningUpload0 = (req, res) => {
    return res.redirect(`back`);
};
const traningUpload1 = (req, res) => {
    return res.redirect(`back`);
};
module.exports = {
    // admin
    getHome: home,
    getAdminLogin: getAdminLogin,
    postAdminLogin: postAdminLogin,
    getAdminRegister: getAdminRegister,
    postAdminRegister: postAdminRegister,
    getFormUser: formUser,
    postFormUser: postFormUser,
    getTableUser: tableUser,
    getDeleteUser: deleteUser,
  
    getFormDoctor: formDoctor,
    postFormDoctor: postFormDoctor,
    getTableDoctor: tableDoctor,
    getDeleteDoctor: deleteDoctor,
  
    getTraning: traning,
    postTraning: postTraning,
    postTraningUpload0: traningUpload0,
    postTraningUpload1: traningUpload1
};