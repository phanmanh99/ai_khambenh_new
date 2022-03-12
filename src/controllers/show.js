const fs = require("fs");

const db = require("../models");
const Image = db.images;

//api test lay du lieu
const showImage = async (req, res)=> {
    const data = await Image.findAll();
    console.log(data);
    return res.send(data);
}
module.exports = {
  showImage: showImage
};
