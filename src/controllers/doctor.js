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
// =============== DOCTOR ========================
// ===============================================
const homeDoctor = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/doctor/index`));
};
const doctorForm = (req, res) => {
    return res.render(path.join(`${__dirname}/../views/doctor/form`));
};
const doctorTable = async (req, res) => {
    const inforUser = await InforUser.findAll({
        where: {
            username: null,
            createby: req.session.User.idbacsi
        },
    });
    const image = await Image.findAll({
        where: {
            idbacsi: req.session.User.idbacsi,
            inforimage: 1
        },
    });

    const datas = [];

    for (const element of image) {
        for (const element2 of inforUser) {
            if (element.idbenhnhan == element2.idbenhnhan) {
                datas.push(
                    {
                        hoten: element2.hoten,
                        nameimage: element.nameimage,
                        status: 1
                    }
                )
            }
        }
    }
    return res.render(path.join(`${__dirname}/../views/doctor/table`), {
        datas: datas
    });
};
const doctorEdit = async (req, res) => {
    // console.log(req);
    // await Admins.create({
    //   username: req.body.username,
    //   password: req.body.password,
    //   role: 1,
    // })
    let data = {};
    if (req.file) data.nameimage = req.file.filename;
    if (req.body.username) data.name = req.body.username;
    if (req.body.infer_doctor) data.infer_doctor = req.body.infer_doctor;
    console.log(data);
    await Image.update(data, {
        where: { id: req.body.id },
    });
    return res.redirect("/doctor/table");
};
const doctorDelete = async (req, res) => {
    await Image.destroy({
        where: { id: req.params.id },
    });
    const data = await Image.findAll();
    // res.send("123");
    return res.render(path.join(`${__dirname}/../views/doctor/table`), {
        datas: data,
    });
};
const doctorCheck = async (req, res) => {
    const array = await req.params.array.split(",");
    console.log(array);
    // var dataToSend;
    try {
        for (const iterator of array) {
            const python = await spawn(config.cmdPython, [config.aiChuanDoan, iterator]);
            dataToSend = python.toString();
            await Image.update(
                {
                    status: 1,
                    infer_ai: parseInt(dataToSend, 10),
                },
                {
                    where: { nameimage: iterator },
                }
            );
        }
    } catch (e) {
        console.log(e.stderr.toString());
    }
    // try {
    //   const bl = await spawn('venv\\Scripts\\python.exe', ['main.py', array[0]]);
    //   console.log(bl.toString())
    // } catch (e) {
    //   console.log(e.stderr.toString())
    // }
    return res.redirect(`back`);
};
const doctorTableUser = async (req, res) => {
    const data = await InforUser.findAll({
        where: {
            createby: null,
        },
    });
    return res.render(path.join(`${__dirname}/../views/doctor/tableuser`), {
        datas: data,
    });
};

const doctorTimeline = async (req, res) => {
    console.log(req.params.idbenhnhan);
    idbenhnhan = req.params.idbenhnhan;
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
    return res.render(path.join(`${__dirname}/../views/doctor/timeline`), { //TIMELINE
        datas: data,
    });
};

const doctorUser = async (req, res) => {
    idbenhnhan = req.params.idbenhnhan;
    const data = await Image.findAll({
        where: {
            idbenhnhan: idbenhnhan,
        },
    });
    return res.render(path.join(`${__dirname}/../views/doctor/imageusers`), {
        datas: data,
    });
};
const doctorSendMessenger = async (req, res) => {
    console.log(req.session.User);
    console.log(req.params.phone);
    console.log(req.body);
    await Messengers.create({
        idbacsi: req.session.User.idbacsi,
        idbenhnhan: req.params.idbenhnhan,        
        messenger: req.body.messenger,
        status: 0
    });
    const data = await Image.findAll({
        where: {
            idbenhnhan: req.params.idbenhnhan,
        },
    });
    return res.render(path.join(`${__dirname}/../views/doctor/imageusers`), {
        datas: data,
    });
};
const doctorMessengers = async (req, res) => {
    const data = await InforUser.findAll({
        where: {
            createby: null
        },
    });
    return res.render(path.join(`${__dirname}/../views/doctor/usermessengers`), {
        datas: data,
    });
};
const doctorMessenger = async (req, res) => {
    const data = await Messengers.findAll({
        where: {
            idbenhnhan: req.params.idbenhnhan,
        },
    });
    console.log(data);
    return res.render(path.join(`${__dirname}/../views/doctor/usermessenger`), {
        datas: data,
    });
};
// ===============================================
// =============== Unknown =======================
// ===============================================
const updata = async (req, res) => {
    await Image.update(
        {
            sick: parseInt(req.query.sick, 10),
        },
        {
            where: { id: req.query.id },
        }
    );

    return res.redirect("/table");
};
const python = (req, res) => {
    var dataToSend;
    // spawn new child process to call the python script
    console.log(req);
    const python = spawn(config.cmdPython, [config.aiChuanDoan, req.query.nameimage]);
    // collect data from script
    python.stdout.on("data", function (data) {
        console.log("Pipe data from python script ...");
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on("close", (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        return res.redirect("/updata?id=" + req.query.id + "&sick=" + dataToSend);
    });
};
const getEdit = async (req, res) => {
    return res.redirect("/table");
};
const getDelete = async (req, res) => {
    await Image.destroy({
        where: { id: req.query.id },
    });
    return res.redirect("/table");
};
const getLogout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};

module.exports = {
    // doctor
    getHoneDoctor: homeDoctor,
    getDoctorForm: doctorForm,
    getDoctorTable: doctorTable,
    getDoctorCheck: doctorCheck,
    getDoctorTimeline: doctorTimeline,
    postDoctorEdit: doctorEdit,
    getDoctorDelete: doctorDelete,
    getDoctorTableUser: doctorTableUser,
    getDoctorUser: doctorUser,
    postDoctorSendMessenger: doctorSendMessenger,
    getDoctorMessengers: doctorMessengers,
    getDoctorMessenger: doctorMessenger,
    getPython: python,
    getUpdata: updata,
    getEdit,
    getDelete,
    getLogout,
};