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
// ================== API ========================
// ===============================================
const apiBacSy = async (req, res) => {
    const data = await axios.get(config.hostAPI + "/benhvien/services/service1.php");
    console.log(data)
    return res.render(path.join(`${__dirname}/../views/admin/apiDoctor`), {
        datas: data.data,
    });
};

const apiBenhNhan = async (req, res) => {
    const data = await axios.get(config.hostAPI + "/benhvien/services/service2.php");
    return res.render(path.join(`${__dirname}/../views/admin/apiPatient`), {
        datas: data.data,
    });
};

const apiLichSu = async (req, res) => {
    const data = await axios.get(config.hostAPI + "/benhvien/services/service3.php");
    return res.render(path.join(`${__dirname}/../views/admin/apiHistory`), {
        datas: data.data,
    });
};

const apiRates = async (req, res) => {
    const data = await axios.get("https://www.dongabank.com.vn/exchange/export");
    console.log(data.data.items);
    return res.render(path.join(`${__dirname}/../views/admin/apiRates`), {
        datas: data.data,
    });
};

const apiChatbots = async (req, res) => {
    chatbot = req.query.messager;
    console.log(chatbot);
    try {
        const python = await spawn(config.cmdPython, [
          config.aiChatBot,
          chatbot,
        ]);
        dataToSend = python.toString();
    } catch (e) {
    console.log(e.stderr.toString());
    }
    return res.send({messager: dataToSend});
}

module.exports = {
  //api
  getAPIDoctor: apiBacSy,
  getAPIPatient: apiBenhNhan,
  getAPIHistory: apiLichSu,
  getAPIRates: apiRates,
  getAPIChatbots: apiChatbots,
};