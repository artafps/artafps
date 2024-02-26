const Course = require("../models/Course");
const Group = require("../models/Group");
const Class = require("../models/Class");
const Type = require("../models/Type");
const Factor = require("../models/Factor");
const classe = require("../classes.json");
const groups = require("../groups.json");
const types = require("../types.json");
exports.handleCreateCourse = async (req, res, next) => {
  try {
    const { name, groupid, classid, typeid, price, bio } = req.body;
    const findName = await Course.findOne({ name });
    if (findName !== null) {
      return res.status(403).json({ message: "نام تکراری می باشد" });
    }
    const findbyidG = await Group.findById(groupid);
    if (findbyidG === null) {
      return res.status(400).json({ message: "  گروه اشتباه می باشد" });
    }
    const findbyidC = await Class.findById(classid);
    if (findbyidC === null) {
      return res.status(400).json({ message: " نوع اشتباه می باشد" });
    }
    const findbyidT = await Type.findById(typeid);
    if (findbyidT === null) {
      return res.status(400).json({ message: " رده اشتباه می باشد" });
    }
    const data = { name, groupid, classid, typeid, price, bio };
    await Course.courseValid(data);
    await Course.create(data);
    return res.status(201).json({ message: "دوره با موفقیت اضافه شد" });
  } catch (err) {
    return res.status(500).json({ err, message: "ERR 500" });
  }
};

exports.handleEditCourse = async (req, res, next) => {
  try {
    const { id, name, price, bio } = req.body;
    const sbyid = await Course.findById(id);
    if (sbyid === null) {
      return res.status(404).json({ message: "آیدی اشتباه است" });
    }
    const newName = name !== undefined ? name : sbyid.name;
    const newGroupid = sbyid.groupid;
    const newClassid = sbyid.classid;
    const newTypeid = sbyid.typeid;
    const newPrice = price !== undefined ? price : sbyid.price;
    const findName = await Course.findOne({ name: newName });
    if (findName !== null) {
      if (findName.id !== id) {
        return res.status(403).json({ message: "نام تکراری می باشد" });
      }
    }
    const data = {
      name: newName,
      groupid: newGroupid,
      classid: newClassid,
      typeid: newTypeid,
      price: newPrice,
      bio,
    };
    await Course.courseValid(data);
    await Course.findByIdAndUpdate(id, data);
    return res.status(200).json({ message: "دوره با موفقیت ویرایش شد" });
  } catch (err) {
    return res.status(500).json({ err, message: "ERR 500" });
  }
};

exports.handleGetCourse = async (req, res, next) => {
  try {
    // limit  2 parameter skil limit 1-10 2-10  
    const allCourse = await Course.find();
    const data = [];
    for (let i = 0; i < allCourse.length; i++) {
      const item = allCourse[i];
      const VC = classe.filter(jetm => {
        if (jetm._id.toString() === item.classid.toString()) {
          return jetm
        }
      })
      const VG = groups.filter(jetm => {
        if (jetm._id.toString() === item.groupid.toString()) {
          return jetm
        }
      })
      const VT = types.filter(jetm => {
        if (jetm._id.toString() === item.typeid.toString()) {
          return jetm
        }
      })
      const d = {
        _id: item.id,
        name: item.name,
        group: VG[0],
        class: VC[0],
        type: VT[0],
        price: item.price,
        bio: item.bio,
        createdAt: item.createdAt
      };
      data.push(d)
    }
    return res
      .status(200)
      .json({ data, message: "داده ها با موفقیت ارسال شد" });
  } catch {
    return res.status(500).json({ message: "ERR 500" });
  }
};

exports.handleDeleteCourse = async (req, res, nex) => {
  try {
    const { id } = req.body;
    const Factors = await Factor.find({ courseid: id })
    if (Factors.length > 0) {
      return res.status(403).json({ message: "دوره چند بار به فروش رسیده است امکان حذف وجود ندارد" });
    }
    const resultDel = await Course.findByIdAndDelete(id);
    if (resultDel === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }
    return res.status(200).json({ message: "دوره حذف شد" });
  } catch {
    return res.status(500).json({ message: "ERR 500" });
  }
};
