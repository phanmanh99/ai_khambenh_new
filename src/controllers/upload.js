const fs = require("fs");
const path = require("path");

const db = require("../models");

const Account = db.account
const Image = db.image;
const ChiTietKham = db.chitietkham;
const InforDoctor = db.infordoctor;
const InforUser = db.inforuser;
const KhamBenh = db.khambenh
const Messengers = db.messenger;

// ve trang upload
const index = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/upload.html`));
  };
  
//luu anh vao db
const uploadFiles = async (req, res) => {
    try {
    // console.log(req);

    if (req.files < 1) {
      return res.send(`You must select a file.`);
    }

  const arrimage = []
  const arruser = []
  if (req.session.User){
    arruser.push({hoten: req.body.hoten,
      sdt: req.body.sdt,
      sobhyt: req.body.bhyt,
      createby: req.session.User.idbacsi});
    const inforUser = await InforUser.bulkCreate(arruser)

    for (const iterator of req.files) {
      // console.log(iterator.filename);
      arrimage.push(
        {idbacsi: req.session.User.idbacsi,
          idbenhnhan: inforUser[0].idbenhnhan,
        nameimage: iterator.filename,
        status: 0,
        inforimage: 1}
        );
    }
    Image.bulkCreate(arrimage);
  }
  else{
    arruser.push({hoten: req.body.hoten,
      sdt: req.body.sdt,
      sobhyt: req.body.bhyt
      });
    const inforUser = await InforUser.bulkCreate(arruser)

    for (const iterator of req.files) {
      // console.log(iterator.filename);
      arrimage.push(
        {idbenhnhan: inforUser[0].idbenhnhan,
        nameimage: iterator.filename,
        status: 0,
        inforimage: 1}
        );
    }
    Image.bulkCreate(arrimage);
    }

  // console.log(arrays);
  // console.log(req.body);
  // console.log(!req.body)
  return res.redirect("back");

    } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles : uploadFiles,
  getIndex : index
};
