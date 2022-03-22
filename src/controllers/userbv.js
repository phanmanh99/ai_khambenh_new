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


const homeUserBV = async (req, res) => {
    console.log()
    const messenger = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.idbenhnhan,
            status: 0,
        },
    });
    return res.render(path.join(`${__dirname}/../views/userbenhvien/index`), {
        messenger: messenger,
    });
};
const getTimeline = async (req, res) => {
    idbenhnhan = req.session.User.idbenhnhan;
    const khambenh = await KhamBenh.findAll({
        where: {
            idbenhnhan: idbenhnhan,
        },
    });
    const idkhambenh = khambenh[0].idkhambenh;
    const data = await ChiTietKham.findAll({
        where: {
            idkhambenh: idkhambenh,
        },
    });
    return res.render(path.join(`${__dirname}/../views/userbenhvien/timeline`),{
        datas: data
    });    
};

const form = async (req, res) => {
    console.log(req.session.User.idbenhnhan);
    const messenger = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.idbenhnhan,
            status: 0,
        },
    });
    return res.render(path.join(`${__dirname}/../views/userbenhvien/form`), {
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
                idbacsi: null,
                idbenhnhan: req.session.User.idbenhnhan,
                nameimage: iterator.filename,
                status: 1,
                infer_ai: parseInt(dataToSend, 10),
                infer_doctor: null,
                inforimage: 2
            });
        }
    } catch (e) {
        console.log(e.stderr.toString());
    }
    return res.redirect(`back`);
    // return res.render(path.join(`${__dirname}/../views/form`));
};

const userDelete = async (req, res) => {
    await Image.destroy({
        where: { idimage: req.params.id },
    });
    return res.redirect("back");
};

const table = async (req, res) => {
    console.log(req.session.User.idbenhnhan);
    const messenger = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.idbenhnhan,
            status: 0,
        },
    });
    const image = await Image.findAll({
        where: {
            idbenhnhan: req.session.User.idbenhnhan,
        },
    });

    const inforUser = await InforUser.findAll({
        where: {
            idbenhnhan: req.session.User.idbenhnhan
        },
    });

    const inforDoctor = await InforDoctor.findAll({
        where: {
            idbacsi: image[0].idbacsi
        },
    });
    
    const datas = [];

    for (const element of image) {
        for (const element2 of inforUser) {
            if (element.idbenhnhan == element2.idbenhnhan) {
                if(element.idbacsi){
                    const inforDoctor = await InforDoctor.findAll({
                        where: {
                            idbacsi: element.idbacsi
                        },
                    });
                    datas.push(
                        {   
                            idimage: element.idimage,
                            hoten: element2.hoten,
                            idbacsi: inforDoctor[0].hoten,
                            nameimage: element.nameimage,
                            status: element.status,
                            infer_ai: element.infer_ai,
                            infer_doctor: element.infer_doctor,
                            createdAt: element.createdAt
                        }
                    )
                }
                else{
                    datas.push(
                        {   
                            idimage: element.idimage,
                            hoten: element2.hoten,
                            idbacsi: element.idbacsi,
                            nameimage: element.nameimage,
                            status: element.status,
                            infer_ai: element.infer_ai,
                            infer_doctor: element.infer_doctor,
                            createdAt: element.createdAt
                        }
                    )
                }
                
            }
        }
    }
    return res.render(path.join(`${__dirname}/../views/userbenhvien/table`), {
        datas: datas,
        messenger: messenger,
    });
};

const Messenger = async (req, res) => {
    console.log(req.session.User.idbenhnhan)
    const data = await Messengers.findAll({
        where: {
            idbenhnhan: req.session.User.idbenhnhan,
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
    return res.render(path.join(`${__dirname}/../views/userbenhvien/messengers`), {
        datas: data,
        messenger: messenger,
    });
};

module.exports = {
    // user  
    getForm: form,
    getTimeline: getTimeline,
    getHomeUserBV: homeUserBV,
    postForm: postForm,
    getTable: table,
    getUserDelete: userDelete,
    getMessenger: Messenger,
    
  };