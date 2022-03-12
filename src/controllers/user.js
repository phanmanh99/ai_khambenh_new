const path = require("path");
const db = require("../models");
const spawn = require("await-spawn");
const { array } = require("../middleware/upload");
const md5 = require("md5");
const config = require("../config/config");
const axios = require("axios");
const console = require("console");
const { count } = require("console");

const Account = db.account
const Image = db.image;
const ChiTietKham = db.chitietkham;
const InforDoctor = db.infordoctor;
const InforUser = db.inforuser;
const KhamBenh = db.khambenh
const Messengers = db.messenger;

// ===============================================
// ================= USER ========================
// ===============================================
const homeUser = async (req, res) => {
    const messenger = await Messengers.findAll({
        where: {

            idbenhnhan: req.session.User.username,
            status: 0,
        },
    });
    return res.render(path.join(`${__dirname}/../views/index`), {
        messenger: messenger,
    });
};

const getCheckInfor = (req, res) => {
  return res.render(path.join(`${__dirname}/../views/addinfor`));
};

const postCheckInfor = async (req, res) => {
  console.log(req.session.User.username);
  await InforUser.create({
    idbenhnhan: null,
    username: req.session.User.username,
    hoten: req.body["hoten"],
    diachi: req.body["diachi"],
    cmnd: req.body["cmnd"],
    sdt: req.body["sdt"],
    email: req.body["email"],
    sobhyt: req.body["bhyt"],
    tiensubenh: req.body["tsbl"],
  });
  req.session.User.id = infor.idbenhnhan;
  return res.redirect("/form");
};

const getLogin = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/login`));
};
const postLogin = async (req, res) => {
    // console.log(req);
    const users = await Account.findAll({
        where: { username: req.body.username },
    });
    if (users.length) {
        if (users[0].password == md5(req.body.password)) {
            req.session.User = {
                id: 0,
                username: users[0].username,
                role: users[0].role,
                infor: 0,
            };
            const infor = await InforUser.findAll({
                where: { username: req.body.username },
            });
            if (infor.length) {
                //return res.redirect("/");
                req.session.User.infor = 1;
                req.session.User.id = infor.idbenhnhan;
            }
                return res.redirect("/");
        }
    }
    return res.render(path.join(`${__dirname}/../views/login`), {
        err_msg: "Tài khoản hoặc mật khẩu không đúng",
    });
};
const getRegister = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/register`));
};
const postRegister = async (req, res) => {
    const account = await Account.findAll({
        where: { username: req.body.username },
    });
    if (account.length) {
        return res.render(path.join(`${__dirname}/../views/register`), {
            err_msg: "Tài khoản đã được tạo trước đây!",
        });
    }
    else {
        console.log(req.body.username)
        await Account.create({
            username: req.body["username"],
            password: md5(req.body["password"]),
            role: 2
        });
        return res.redirect("/login");
    }
};
const form = async (req, res) => {
    const messenger = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.username,
            status: 0,
        },
    });
    return res.render(path.join(`${__dirname}/../views/form`), {
        messenger: messenger,
    });
};
const postForm = async (req, res) => {
    // console.log(req.files)
    // console.log(req.session.User.username)
    try {
        for (const iterator of req.files) {
            const python = await spawn(config.cmdPython, [
                config.aiChuanDoan,
                iterator.filename,
            ]);
            dataToSend = python.toString();
            await Image.create({
                phone: req.session.User.username,
                nameimage: iterator.filename,
                infer_ai: parseInt(dataToSend, 10),
            });
        }
    } catch (e) {
        console.log(e.stderr.toString());
    }
    return res.redirect(`back`);
    // return res.render(path.join(`${__dirname}/../views/form`));
};
const table = async (req, res) => {
    const messenger = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.username,
            status: 0,
        },
    });
    const data = await UserImage.findAll({
        where: {
            phone: req.session.User.username,
        },
    });
    return res.render(path.join(`${__dirname}/../views/table`), {
        datas: data,
        messenger: messenger,
    });
};
const userDelete = async (req, res) => {
    await UserImage.destroy({
        where: { id: req.params.id },
    });
    return res.redirect("back");
};
const Messenger = async (req, res) => {
    const data = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.username,
        },
    });
    await Messengers.update({ status: 1 }, {
        where: {
            idbenhnhan: req.session.User.username,
        },
    });
    const messenger = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.username,
            status: 0,
        },
    });
    return res.render(path.join(`${__dirname}/../views/messengers`), {
        datas: data,
        messenger: messenger,
    });
};
module.exports = {
  // user
  getHomeUser: homeUser,
  getForm: form,
  postForm: postForm,
  getTable: table,
  getUserDelete: userDelete,
  getCheckInfor: getCheckInfor,
  postCheckInfor: postCheckInfor,
  getMessenger: Messenger,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
};