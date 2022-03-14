const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const adminController = require("../controllers/admin");
const doctorController = require("../controllers/doctor");
const apiController = require("../controllers/api");
const showController = require("../controllers/show");
const uploadController = require("../controllers/upload");
const upload = require("../middleware/upload");
const upload0 = require("../middleware/upload0");
const upload1 = require("../middleware/upload1");
const isAdmin = require("../middleware/isAdmin");

let routes = (app) => {
  // ===============================================
  // ================= USER ========================
  // ===============================================
  router.get("/timeline",userController.getTimeline)
  router.get("/", isAdmin.isUser, userController.getHomeUser);
  router.get("/login", userController.getLogin);
  router.post("/login", upload.single("file"), userController.postLogin);
  router.get("/register", userController.getRegister);
  router.post("/register", upload.single("file"), userController.postRegister);
  router.get("/form", isAdmin.isUser, userController.getForm);
  router.post(
    "/form",
    isAdmin.isUser,
    upload.array("file", 10),
    userController.postForm
  );
  router.get("/checkinfor", userController.getCheckInfor);
  router.post("/checkinfor", upload.single("file"), userController.postCheckInfor);
  router.get("/delete/:id", isAdmin.isUser, userController.getUserDelete);
  router.get("/table", isAdmin.isUser, userController.getTable);
  router.get("/messenger", isAdmin.isUser, userController.getMessenger);
  // ===============================================
  // ================ ADMIN ========================
  // ===============================================
  router.get("/admin/", isAdmin.isAdmin, adminController.getHome);
  router.get("/admin/login", adminController.getAdminLogin);
  router.post(
    "/admin/login",
    upload.single("file"),
    adminController.postAdminLogin
  );
  router.get("/admin/register", adminController.getAdminRegister);
  router.post(
    "/admin/register",
    upload.single("file"),
    adminController.postAdminRegister
  );
  router.get("/admin/formUser", isAdmin.isAdmin, adminController.getFormUser);
  router.post(
    "/admin/formUser",
    isAdmin.isAdmin,
    upload.single("file"),
    adminController.postFormUser
  );
  router.get("/admin/tableUser", isAdmin.isAdmin, adminController.getTableUser);
  router.get(
    "/admin/deleteUser/:username",
    isAdmin.isAdmin,
    adminController.getDeleteUser
  );
  router.get(
    "/admin/formDoctor",
    isAdmin.isAdmin,
    adminController.getFormDoctor
  );
  router.post(
    "/admin/formDoctor",
    upload.single("file"),
    adminController.postFormDoctor
  );
  router.get(
    "/admin/tableDoctor",
    isAdmin.isAdmin,
    adminController.getTableDoctor
  );
  router.get(
    "/admin/deleteDoctor/:username",
    isAdmin.isAdmin,
    adminController.getDeleteDoctor
  );
  router.get("/admin/traning", isAdmin.isAdmin, adminController.getTraning);
  router.get(
    "/admin/traning/train",
    isAdmin.isAdmin,
    adminController.postTraning
  );
  router.post(
    "/admin/traning/upload0",
    upload0.array("file", 10),
    isAdmin.isAdmin,
    adminController.postTraningUpload0
  );
  router.post(
    "/admin/traning/upload1",
    upload1.array("file", 10),
    isAdmin.isAdmin,
    adminController.postTraningUpload1
  );
  // ===============================================
  // =============== DOCTOR ========================
  // ===============================================
  router.get("/doctor/", isAdmin.isDoctor, doctorController.getHoneDoctor);
  router.get("/doctor/form", isAdmin.isDoctor, doctorController.getDoctorForm);
  router.get("/doctor/table", isAdmin.isDoctor, doctorController.getDoctorTable);
  router.get(
    "/doctor/check/:array",
    isAdmin.isDoctor,
    doctorController.getDoctorCheck
  );
  router.post(
    "/doctor/edit",
    upload.single("file"),
    doctorController.postDoctorEdit
  );
  router.get(
    "/doctor/delete/:id",
    isAdmin.isDoctor,
    doctorController.getDoctorDelete
  );
  router.get(
    "/doctor/tableuser",
    isAdmin.isDoctor,
    doctorController.getDoctorTableUser
  );
  router.get(
    "/doctor/user/:phone",
    isAdmin.isDoctor,
    doctorController.getDoctorUser
  );
  router.post(
    "/doctor/user/send/:phone",
    upload.single("file"),
    isAdmin.isDoctor,
    doctorController.postDoctorSendMessenger
  );
  router.get(
    "/doctor/messengers",
    isAdmin.isDoctor,
    doctorController.getDoctorMessengers
  );
  router.get(
    "/doctor/messenger/:phone",
    isAdmin.isDoctor,
    doctorController.getDoctorMessenger
  );
  // ===============================================
  // ================== API ========================
  // ===============================================
    router.get(
      "/chatbot",
      isAdmin.isUser,
      apiController.getAPIChatbots
    );

  router.get(
    "/admin/apiDoctor",
    isAdmin.isDoctor,
    apiController.getAPIDoctor
  );
  router.get(
    "/admin/apiPatient",
    isAdmin.isDoctor,
    apiController.getAPIPatient
  );
  router.get(
    "/admin/apiHistory",
    isAdmin.isDoctor,
    apiController.getAPIHistory
  );
  router.get(
    "/admin/apiRates",
    isAdmin.isDoctor,
    apiController.getAPIRates
  );
  // ===============================================
  // =============== Unknown =======================
  // ===============================================
  router.get("/updata", doctorController.getUpdata);
  router.get("/edit", doctorController.getEdit);
  // router.get("/delete", homeController.getDelete);
  router.get("/python", upload.single("file"), doctorController.getPython);
  // hien anh
  router.get("/show", showController.showImage);
  // hien form up anh
  router.get("/upload", uploadController.getIndex);
  // post anh len db
  router.post(
    "/upload",
    upload.array("file", 10),
    uploadController.uploadFiles
  );
  router.get("/logout", doctorController.getLogout);
  return app.use("/", router);
};
module.exports = routes;
