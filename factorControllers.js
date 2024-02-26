const Factor = require("../models/Factor");
const Course = require("../models/Course");
const Personal = require("../models/Personal");
const Student = require("../models/Student");
const Sal = require("../models/Sals");

const Group = require("../models/Group");
const Classs = require("../models/Class");
const Type = require("../models/Type");
const RewardPerson = require("../models/RewardPersonal");
const Reward = require("../models/Reward");
const moment = require("jalali-moment");
const Gift = require("../models/Gift");
const classe = require("../classes.json");
const groups = require("../groups.json");
const types = require("../types.json");


const functionUtilsPadash = async (listpayment, installments, supervisorid, suportid, courseid, dateCreate, fixDateCreateAT, sbyidGroup, sbyidClass) => {

  if (listpayment.length === installments.length) {
    const supervisor2 = await Personal.findById(supervisorid)
    const suport2 = await Personal.findById(suportid)
    const titleG = await sbyidGroup.title;
    const titleC = await sbyidClass.title;
    const rewardPerson = await RewardPerson.findOne({
      personalid: supervisorid,
    });
    const rewardPersonsuport = await RewardPerson.findOne({
      personalid: suportid,
    });
    const rew = await Reward.find();
    const reward = rew[0];
    // محاسبه چالشی پاداش یعنی درصپرتی که توی سه ماه پاداش رو نزد بیا صفر کن اون پاداش رو
    if (titleG === "راه موفقیت") {
      const listFactorSuporter = await Factor.find({
        suportid,
      })
      //sort by class and group id  
      const newListSortByTGC = []
      for (let i = 0; i < listFactorSuporter.length; i++) {
        const e = listFactorSuporter[i];
        if (String(courseid) === String(e.courseid)) {
          newListSortByTGC.push(e)
        }
      }
      //sort by payment final
      const newListFactorSortByPayments = []
      for (let i = 0; i < newListSortByTGC.length; i++) {
        const e = newListSortByTGC[i];
        const Ie = e.installments
        let pricePaymentYES = 0
        for (let j = 0; j < Ie.length; j++) {
          const e = Ie[j];
          if (e.payment === "yes") {
            pricePaymentYES += parseInt(e.price)
          }
        }
        if (String(pricePaymentYES) === e.priceday) {
          newListFactorSortByPayments.push(e)
        }
      }
      //sort by number lasted factor
      let selectFactorNumber = newListFactorSortByPayments.length - 1
      if (sbyidClass.title === "برنزی") {
        selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPersonsuport.sucbronzeN))
      }
      if (sbyidClass.title === "نقره ای") {
        selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPersonsuport.sucsilverN))
      }
      const facrotSelected = newListFactorSortByPayments[selectFactorNumber]
      if (facrotSelected !== undefined) {
        const DateFacrotSelected = new Date(facrotSelected.editAt.getFullYear(), facrotSelected.editAt.getMonth() + 3, facrotSelected.editAt.getDate(), facrotSelected.editAt.getHours())
        const nowDate = new Date()
        if (DateFacrotSelected < nowDate) {
          if (sbyidClass.title === "برنزی") {
            const rewardPersonData = {
              personalid: suportid,
              sucsilverN: rewardPersonsuport.sucsilverN,
              sucbronzeN: "0",
              vipsilverN: rewardPersonsuport.vipsilverN,
              vipgoldenN: rewardPersonsuport.vipgoldenN,
              vipdiamondN: rewardPersonsuport.vipdiamondN,
            };
            await RewardPerson.findByIdAndUpdate(
              rewardPersonsuport.id,
              rewardPersonData
            );
          }
          if (sbyidClass.title === "نقره ای") {
            const rewardPersonData = {
              personalid: suportid,
              sucsilverN: "0",
              sucbronzeN: rewardPersonsuport.sucbronzeN,
              vipsilverN: rewardPersonsuport.vipsilverN,
              vipgoldenN: rewardPersonsuport.vipgoldenN,
              vipdiamondN: rewardPersonsuport.vipdiamondN,
            };
            await RewardPerson.findByIdAndUpdate(
              rewardPersonsuport.id,
              rewardPersonData
            );
          }
        }
      }
    }
    if (titleG === "vip") {
      const listFactorSuperviser = await Factor.find({
        supervisorid,
      })
      //sort by class and group id  
      const newListSortByTGC = []
      for (let i = 0; i < listFactorSuperviser.length; i++) {
        const e = listFactorSuperviser[i];
        if (String(courseid) === String(e.courseid)) {
          newListSortByTGC.push(e)
        }
      }
      //sort by payment final
      const newListFactorSortByPayments = []
      for (let i = 0; i < newListSortByTGC.length; i++) {
        const e = newListSortByTGC[i];
        const Ie = e.installments
        let pricePaymentYES = 0
        for (let j = 0; j < Ie.length; j++) {
          const e = Ie[j];
          if (e.payment === "yes") {
            pricePaymentYES += parseInt(e.price)
          }
        }
        if (String(pricePaymentYES) === e.priceday) {
          newListFactorSortByPayments.push(e)
        }
      }
      //sort by number lasted factor
      let selectFactorNumber = newListFactorSortByPayments.length - 1
      if (sbyidClass.title === "نقره ای") {
        selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPerson.vipsilverN))
      }
      if (sbyidClass.title === "طلایی") {
        selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPerson.vipgoldenN))
      }
      if (sbyidClass.title === "الماسی") {
        selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPerson.vipdiamondN))
      }
      const facrotSelected = newListFactorSortByPayments[selectFactorNumber]
      if (facrotSelected !== undefined) {
        const DateFacrotSelected = new Date(facrotSelected.editAt.getFullYear(), facrotSelected.editAt.getMonth() + 3, facrotSelected.editAt.getDate(), facrotSelected.editAt.getHours())
        const nowDate = new Date()
        if (DateFacrotSelected < nowDate) {
          if (sbyidClass.title === "نقره ای") {
            const rewardPersonData = {
              personalid: supervisorid,
              sucsilverN: rewardPerson.sucsilverN,
              sucbronzeN: rewardPerson.sucbronzeN,
              vipsilverN: "0",
              vipgoldenN: rewardPerson.vipgoldenN,
              vipdiamondN: rewardPerson.vipdiamondN,
            };
            await RewardPerson.findByIdAndUpdate(
              rewardPerson.id,
              rewardPersonData
            );
          }
          if (sbyidClass.title === "طلایی") {
            const rewardPersonData = {
              personalid: supervisorid,
              sucsilverN: rewardPerson.sucsilverN,
              sucbronzeN: rewardPerson.sucbronzeN,
              vipsilverN: rewardPerson.vipsilverN,
              vipgoldenN: "0",
              vipdiamondN: rewardPerson.vipdiamondN,
            };
            await RewardPerson.findByIdAndUpdate(
              rewardPerson.id,
              rewardPersonData
            );
          }
          if (sbyidClass.title === "الماسی") {
            const rewardPersonData = {
              personalid: supervisorid,
              sucsilverN: rewardPerson.sucsilverN,
              sucbronzeN: rewardPerson.sucbronzeN,
              vipsilverN: rewardPerson.vipsilverN,
              vipgoldenN: rewardPerson.vipgoldenN,
              vipdiamondN: "0",
            };
            await RewardPerson.findByIdAndUpdate(
              rewardPerson.id,
              rewardPersonData
            );
          }
        }
      }
    }

    // محاسبه پاداش
    switch (titleG) {
      case "راه موفقیت":
        switch (titleC) {
          case "برنزی":
            if ((parseInt(rewardPersonsuport.sucbronzeN) + 1) === parseInt(reward.sucbronzeN)) {
              rewardPersonsuport.sucbronzeN = String(
                parseInt(rewardPersonsuport.sucbronzeN) + 1
              );
              suport2.salary = String(
                parseInt(suport2.salary) +
                parseInt(reward.sucbronzeP)
              );
              const giftData = {
                personalid: suportid,
                title: `${titleG}-${titleC}-1`,
                price: reward.sucbronzeP,
                smunber: reward.sucbronzeN,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              const supervisorData = {
                salary: suport2.salary,
              };
              await Personal.findByIdAndUpdate(suportid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            } else if ((parseInt(rewardPersonsuport.sucbronzeN) + 1) === parseInt(reward.sucbronzeN2)) {
              rewardPersonsuport.sucbronzeN = "0";
              suport2.salary = String(
                parseInt(suport2.salary) +
                parseInt(reward.sucbronzeP2)
              );
              const giftData = {
                personalid: suportid,
                title: `${titleG}-${titleC}-2`,
                price: reward.sucbronzeP2,
                smunber: reward.sucbronzeN2,
                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              const supervisorData = {
                salary: suport2.salary,
              };
              await Personal.findByIdAndUpdate(suportid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            } else {
              rewardPersonsuport.sucbronzeN = String(
                parseInt(rewardPersonsuport.sucbronzeN) + 1
              );
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            }
            break;
          case "نقره ای":
            if ((parseInt(rewardPersonsuport.sucsilverN) + 1) === parseInt(reward.sucsilverN)) {
              rewardPersonsuport.sucsilverN = String(
                parseInt(rewardPersonsuport.sucsilverN) + 1
              );
              suport2.salary = String(
                parseInt(suport2.salary) +
                parseInt(reward.sucsilverP)
              );
              const giftData = {
                personalid: suportid,
                title: `${titleG}-${titleC}-1`,
                price: reward.sucsilverP,
                smunber: reward.sucsilverN,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              const supervisorData = {
                salary: suport2.salary,
              };
              await Personal.findByIdAndUpdate(suportid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            } else if ((parseInt(rewardPersonsuport.sucsilverN) + 1) === parseInt(reward.sucsilverN2)) {
              rewardPersonsuport.sucsilverN = "0";
              suport2.salary = String(
                parseInt(suport2.salary) +
                parseInt(reward.sucsilverP2)
              );
              const giftData = {
                personalid: suportid,
                title: `${titleG}-${titleC}-2`,
                price: reward.sucsilverP2,
                smunber: reward.sucsilverN2,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              const supervisorData = {
                salary: suport2.salary,
              };
              await Personal.findByIdAndUpdate(suportid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            } else {
              rewardPersonsuport.sucsilverN = String(
                parseInt(rewardPersonsuport.sucsilverN) + 1
              );
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            }
            break;
          default:
            break;
        }
        break;
      case "vip":
        switch (titleC) {
          case "نقره ای":
            if ((parseInt(rewardPerson.vipsilverN) + 1) === parseInt(reward.vipsilverN)) {
              rewardPerson.vipsilverN = "0";
              supervisor2.salary = String(
                parseInt(supervisor2.salary) +
                parseInt(reward.vipsilverP)
              );
              const giftData = {
                personalid: supervisorid,
                title: `${titleG}-${titleC}-1`,
                price: reward.vipsilverP,
                smunber: reward.vipsilverN,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              const supervisorData = {
                salary: supervisor2.salary,
              };
              await Personal.findByIdAndUpdate(supervisorid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            } else {
              rewardPerson.vipsilverN = String(
                parseInt(rewardPerson.vipsilverN) + 1
              );
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            }
            break;
          case "طلایی":
            if ((parseInt(rewardPerson.vipgoldenN) + 1) === parseInt(reward.vipgoldenN)) {
              rewardPerson.vipgoldenN = "0";
              supervisor2.salary = String(
                parseInt(supervisor2.salary) +
                parseInt(reward.vipgoldenP)
              );
              const giftData = {
                personalid: supervisorid,
                title: `${titleG}-${titleC}-1`,
                price: reward.vipgoldenP,
                smunber: reward.vipgoldenN,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              const supervisorData = {
                salary: supervisor2.salary,
              };
              await Personal.findByIdAndUpdate(supervisorid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            } else {
              rewardPerson.vipgoldenN = String(
                parseInt(rewardPerson.vipgoldenN) + 1
              );
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            }
            break;
          case "الماسی":
            if ((parseInt(rewardPerson.vipdiamondN) + 1) === parseInt(reward.vipdiamondN)) {
              rewardPerson.vipdiamondN = String(
                parseInt(rewardPerson.vipdiamondN) + 1
              );
              supervisor2.salary = String(
                parseInt(supervisor2.salary) +
                parseInt(reward.vipdiamondP)
              );
              const giftData = {
                personalid: supervisorid,
                title: `${titleG}-${titleC}-1`,
                price: reward.vipdiamondP,
                smunber: reward.vipdiamondN,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              const supervisorData = {
                salary: supervisor2.salary,
              };
              await Personal.findByIdAndUpdate(supervisorid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            } else if ((parseInt(rewardPerson.vipdiamondN) + 1) === parseInt(reward.vipdiamondN2)) {
              rewardPerson.vipdiamondN = String(
                parseInt(rewardPerson.vipdiamondN) + 1
              );
              supervisor2.salary = String(
                parseInt(supervisor2.salary) +
                parseInt(reward.vipdiamondP2)
              );
              const giftData = {
                personalid: supervisorid,
                title: `${titleG}-${titleC}-2`,
                price: reward.vipdiamondP2,
                smunber: reward.vipdiamondN2,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              const supervisorData = {
                salary: supervisor2.salary,
              };
              await Personal.findByIdAndUpdate(supervisorid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            } else if ((parseInt(rewardPerson.vipdiamondN) + 1) === parseInt(reward.vipdiamondN3)) {
              rewardPerson.vipdiamondN = "0";
              supervisor2.salary = String(
                parseInt(supervisor2.salary) +
                parseInt(reward.vipdiamondP3)
              );
              const giftData = {
                personalid: supervisorid,
                title: `${titleG}-${titleC}-3`,
                price: reward.vipdiamondP3,
                smunber: reward.vipdiamondN3,

                createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
              }
              await Gift.giftValid(giftData)
              await Gift.create(giftData)
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              const supervisorData = {
                salary: supervisor2.salary,
              };
              await Personal.findByIdAndUpdate(supervisorid, supervisorData);
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            } else {
              rewardPerson.vipdiamondN = String(
                parseInt(rewardPerson.vipdiamondN) + 1
              );
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
}


exports.handleCreateFactor = async (req, res, next) => {
  try {
    const {
      courseid,
      studentid,
      supervisorid,
      suportid,
      numberinstallment,
      installments,
      dateCreate,
      off
    } = req.body;

    if (
      courseid === undefined ||
      studentid === undefined ||
      supervisorid === undefined ||
      suportid === undefined ||
      numberinstallment === undefined ||
      installments === undefined ||
      off === undefined ||
      dateCreate === undefined
    ) {
      return res
        .status(400)
        .json({ message: "درخواست اشتباه است لطفا به ورودی ها دقت کنید" });
    }
    const datafixdated = `${dateCreate.split("-")[2]}/${parseInt(dateCreate.split("-")[1])}/${parseInt(dateCreate.split("-")[0])}`
    const fixDateCreateAT = moment.from(datafixdated, 'fa', 'YYYY/MM/DD').locale('en').toDate()
    // check the id
    const course = await Course.findById(courseid);
    const sbyidGroup = await Group.findById(course.groupid);
    const sbyidClass = await Classs.findById(course.classid);
    const sbyidType = await Type.findById(course.typeid);
    if (course === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }
    const student = await Student.findById(studentid);
    if (student === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }
    const supervisor2 = await Personal.findById(supervisorid);
    if (supervisor2 === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }
    const suport2 = await Personal.findById(suportid);
    if (suport2 === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }
    const listpayment = [];
    let listpaymentPrice = 0;
    for (let i = 0; i < installments.length; i++) {
      const item = installments[i];
      if (item.payment === "yes") {
        listpayment.push(item);
      }
      listpaymentPrice += parseInt(item.price);
    }
    if (listpaymentPrice !== (parseInt(course.price) - parseInt(off))) {
      return res
        .status(403)
        .json({ message: "مجموع قیمت اقساط با قیمت کالا برابر نیست" });
    }
    const installmentsFixDate = []
    for (let i = 0; i < installments.length; i++) {
      const e = installments[i];
      const datafixdated = `${e.date.split("-")[2]}/${parseInt(e.date.split("-")[1])}/${parseInt(e.date.split("-")[0])}`
      const fixDateAT = moment.from(datafixdated, 'fa', 'YYYY/MM/DD').locale('en').toDate()
      const fData = {
        id: e.id,
        payment: e.payment,
        price: e.price,
        date: fixDateAT,
      }
      installmentsFixDate.push(fData)
    }

    const supervisor = await Personal.findById(supervisorid);
    const suport = await Personal.findById(suportid);
    if (listpayment.length === 0) {
      const data = {
        priceday: String(parseInt(course.price) - parseInt(off)),
        courseid,
        studentid,
        supervisorid,
        suportid,
        numberinstallment,
        offer: off,
        installments: installmentsFixDate,
        editAt: new Date(),
        createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
      };

      await Factor.factorValid(data);
      const CreateFactor = await Factor.create(data);
      functionUtilsPadash(listpayment, installments, supervisorid, suportid, courseid, dateCreate, fixDateCreateAT, sbyidGroup, sbyidClass)
      return res.status(201).json({ message: "فاکتور با موفقیت ساخته شد" });
    }
    let amountPaid = 0;
    for (let i = 0; i < listpayment.length; i++) {
      const e = listpayment[i].price;
      amountPaid += parseInt(e);
    }
    const findFacByStudent = await Factor.find({ studentid });
    var validVip = false;
    for (let i = 0; i < findFacByStudent.length; i++) {
      const e = findFacByStudent[i];
      const course = await Course.findById(e.courseid);
      const group = await Group.findById(course.groupid);
      const type = await Type.findById(course.typeid);
      if (group.title === "vip" && type.title === "مقدماتی") {
        validVip = true;
      }
    }
    if (supervisor.id === suport.id) {
      // 100% superviser == suporter
      const superviser = amountPaid * 1 * 0.1;
      supervisor.salary = String(parseInt(supervisor.salary) + superviser);
      const datasuperviser = {
        number: supervisor.number,
        name: supervisor.name,
        lastname: supervisor.lastname,
        melicode: supervisor.melicode,
        salary: supervisor.salary,
      };
      await Personal.personalValid(datasuperviser);
      await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);

      //create factor
      const data = {
        priceday: String(parseInt(course.price) - parseInt(off)),
        courseid,
        studentid,
        supervisorid,
        suportid,
        numberinstallment,
        installments: installmentsFixDate,
        editAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
        createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
        offer: off,
      };
      await Factor.factorValid(data);
      const factorNew = await Factor.create(data);
      functionUtilsPadash(listpayment, installments, supervisorid, suportid, courseid, dateCreate, fixDateCreateAT, sbyidGroup, sbyidClass)
      const dataSuperviser = {
        personid: supervisorid,
        salary: String(superviser),
        courseid,
        factorid: factorNew.id,
        createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
      };
      await Sal.salaryValid(dataSuperviser);
      await Sal.create(dataSuperviser);
      //response
      return res.status(201).json({ message: "فاکتور با موفقیت ساخته شد" });
    } else {
      if (sbyidGroup.title === "راه موفقیت") {
        // 30% superviser 70% suporter
        const superviser = amountPaid * 0.3 * 0.1;
        const suporter = amountPaid * 0.7 * 0.1;

        // add salary datasuperviser 30%
        supervisor.salary = String(parseInt(supervisor.salary) + superviser);
        const datasuperviser = {
          number: supervisor.number,
          name: supervisor.name,
          lastname: supervisor.lastname,
          melicode: supervisor.melicode,
          salary: supervisor.salary,
        };
        await Personal.personalValid(datasuperviser);
        await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);
        // add salary suport 70%
        suport.salary = String(parseInt(suport.salary) + suporter);
        const datasuporter = {
          number: suport.number,
          name: suport.name,
          lastname: suport.lastname,
          melicode: suport.melicode,
          salary: suport.salary,
        };
        await Personal.personalValid(datasuporter);
        await Personal.findByIdAndUpdate(suport.id, datasuporter);
        //create factor
        const data = {
          priceday: String(parseInt(course.price) - parseInt(off)),
          courseid,
          studentid,
          supervisorid,
          suportid,
          numberinstallment,
          installments: installmentsFixDate,
          editAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
          createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
          offer: off,
        };
        await Factor.factorValid(data);
        const factorNew = await Factor.create(data);
        functionUtilsPadash(listpayment, installments, supervisorid, suportid, courseid, dateCreate, fixDateCreateAT, sbyidGroup, sbyidClass)
        const dataSuperviser = {
          personid: supervisorid,
          salary: String(superviser),
          courseid,
          factorid: factorNew.id,
          createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
        };
        await Sal.salaryValid(dataSuperviser);
        await Sal.create(dataSuperviser);
        const dataSuporter = {
          personid: suportid,
          salary: String(suporter),
          courseid,
          factorid: factorNew.id,
          createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
        };
        await Sal.salaryValid(dataSuporter);
        await Sal.create(dataSuporter);
        //response
        return res.status(201).json({ message: "فاکتور با موفقیت ساخته شد" });
      }
      if (sbyidGroup.title === "vip") {
        if (sbyidType.title === "مقدماتی" && !validVip) {
          // 70% superviser 30% suporter
          const superviser = amountPaid * 0.7 * 0.1;
          const suporter = amountPaid * 0.3 * 0.1;
          // add salary datasuperviser 30%
          supervisor.salary = String(parseInt(supervisor.salary) + superviser);
          const datasuperviser = {
            number: supervisor.number,
            name: supervisor.name,
            lastname: supervisor.lastname,
            melicode: supervisor.melicode,
            salary: supervisor.salary,
          };
          await Personal.personalValid(datasuperviser);
          await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);
          // add salary suport 70%
          suport.salary = String(parseInt(suport.salary) + suporter);
          const datasuporter = {
            number: suport.number,
            name: suport.name,
            lastname: suport.lastname,
            melicode: suport.melicode,
            salary: suport.salary,
          };
          await Personal.personalValid(datasuporter);
          await Personal.findByIdAndUpdate(suport.id, datasuporter);
          //create factor
          const data = {
            priceday: String(parseInt(course.price) - parseInt(off)),
            courseid,
            studentid,
            supervisorid,
            suportid,
            numberinstallment,
            installments: installmentsFixDate,
            editAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
            createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
            offer: off,
          };
          await Factor.factorValid(data);
          const factorNew = await Factor.create(data);
          functionUtilsPadash(listpayment, installments, supervisorid, suportid, courseid, dateCreate, fixDateCreateAT, sbyidGroup, sbyidClass)
          const dataSuperviser = {
            personid: supervisorid,
            salary: String(superviser),
            courseid,
            factorid: factorNew.id,
            createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
          };
          await Sal.salaryValid(dataSuperviser);
          await Sal.create(dataSuperviser);
          const dataSuporter = {
            personid: suportid,
            salary: String(suporter),
            courseid,
            factorid: factorNew.id,
            createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
          };
          await Sal.salaryValid(dataSuporter);
          await Sal.create(dataSuporter);
          //response
          return res.status(201).json({ message: "فاکتور با موفقیت ساخته شد" });
        }
        // 100% superviser
        const superviser = amountPaid * 1 * 0.1;
        // add salary datasuperviser 100%
        supervisor.salary = String(parseInt(supervisor.salary) + superviser);
        const datasuperviser = {
          number: supervisor.number,
          name: supervisor.name,
          lastname: supervisor.lastname,
          melicode: supervisor.melicode,
          salary: supervisor.salary,
        };
        await Personal.personalValid(datasuperviser);
        await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);

        //create factor
        const data = {
          priceday: String(parseInt(course.price) - parseInt(off)),
          courseid,
          studentid,
          supervisorid,
          suportid,
          numberinstallment,
          installments: installmentsFixDate,
          editAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
          createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
          offer: off,
        };
        await Factor.factorValid(data);
        const factorNew = await Factor.create(data);
        functionUtilsPadash(listpayment, installments, supervisorid, suportid, courseid, dateCreate, fixDateCreateAT, sbyidGroup, sbyidClass)
        const dataSuperviser = {
          personid: supervisorid,
          salary: String(superviser),
          courseid,
          factorid: factorNew.id,
          createdAt: dateCreate !== undefined ? fixDateCreateAT : new Date(),
        };
        await Sal.salaryValid(dataSuperviser);
        await Sal.create(dataSuperviser);

        //response
        return res.status(201).json({ message: "فاکتور با موفقیت ساخته شد" });
      }
    }
  } catch (err) {
    return res.status(500).json({ err, message: "ERR 500" });
  }
};

exports.handleEditFactor = async (req, res, next) => {
  try {
    const { id, numberinstallment, installments } = req.body;
    const sbyidFactor = await Factor.findById(id);
    if (sbyidFactor === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }
    const lastArrInstallments = sbyidFactor.installments;
    //now
    const listPaymentNow = [];
    let pricePaymentNow = 0;
    let priceFactorParts = 0;
    for (let i = 0; i < installments.length; i++) {
      const e = installments[i];
      if (e.payment === "yes") {
        listPaymentNow.push(e);
        pricePaymentNow += parseInt(e.price);
      }
      priceFactorParts += parseInt(e.price);
    }

    if (priceFactorParts !== parseInt(sbyidFactor.priceday)) {
      return res
        .status(403)
        .json({ message: "مجموع قیمت اقساط با قیمت کالا برابر نیست" });
    }

    const installmentsFixDate = []
    for (let i = 0; i < installments.length; i++) {
      const e = installments[i];
      const datafixdated = `${e.date.split("-")[2]}/${parseInt(e.date.split("-")[1])}/${parseInt(e.date.split("-")[0])}`
      const fixDateCreateAT = moment.from(datafixdated, 'fa', 'YYYY/MM/DD').locale('en').toDate()
      const fData = {
        id: e.id,
        payment: e.payment,
        price: e.price,
        date: fixDateCreateAT,
      }
      installmentsFixDate.push(fData)
    }
    // lasted
    const listPaymentLasted = [];
    let pricePaymentLast = 0;
    let Valid = true
    for (let i = 0; i < lastArrInstallments.length; i++) {
      const e = lastArrInstallments[i];
      const j = installmentsFixDate[i]
      if (e.payment === "yes") {
        listPaymentLasted.push(e);
        pricePaymentLast += parseInt(e.price);
      }
      if (String(e.date) !== String(j.date)) {
        Valid = false
      }
    }
    if (listPaymentNow.length === 0 && listPaymentLasted.length === 0 && Valid) {
      return res.status(200).json({ message: "فاکتور ویرایش نشده است" });
    }
    if (listPaymentNow.length === listPaymentLasted.length && priceFactorParts === parseInt(sbyidFactor.priceday) && Valid) {
      return res.status(200).json({ message: "فاکتور ویرایش نشده است" });
    }
    if (listPaymentLasted.length > listPaymentNow.length) {
      return res.status(400).json({
        message: "تعداد اقساط پرداخت شده یا باید بیشتر یا مساوی باشد",
      });
    }

    const percent = pricePaymentNow - pricePaymentLast;
    if (
      listPaymentLasted.length < listPaymentNow.length &&
      parseInt(sbyidFactor.priceday) === pricePaymentNow
    ) {
      // محاسبه پاداش
      const supervisorid = sbyidFactor.supervisorid
      const suportid = sbyidFactor.suportid
      const supervisor2 = await Personal.findById(sbyidFactor.supervisorid)
      const suport2 = await Personal.findById(sbyidFactor.suportid)
      const course = await Course.findById(sbyidFactor.courseid)
      const sbyidGroup2 = await Group.findById(course.groupid)
      const sbyidClass2 = await Classs.findById(course.classid)
      const titleG = await sbyidGroup2.title;
      const titleC = await sbyidClass2.title;
      const rewardPerson = await RewardPerson.findOne({
        personalid: supervisorid,
      });
      const rewardPersonsuport = await RewardPerson.findOne({
        personalid: suportid,
      });
      const rew = await Reward.find();
      const reward = rew[0];
      // debug in gifts checker
      if (titleG === "راه موفقیت") {
        const listFactorSuporter = await Factor.find({
          suportid,
        })
        //sort by class and group id  
        const newListSortByTGC = []
        for (let i = 0; i < listFactorSuporter.length; i++) {
          const e = listFactorSuporter[i];
          if (String(sbyidFactor.courseid) === String(e.courseid)) {
            newListSortByTGC.push(e)
          }
        }
        //sort by payment final
        const newListFactorSortByPayments = []
        for (let i = 0; i < newListSortByTGC.length; i++) {
          const e = newListSortByTGC[i];
          const Ie = e.installments
          let pricePaymentYES = 0
          for (let j = 0; j < Ie.length; j++) {
            const e = Ie[j];
            if (e.payment === "yes") {
              pricePaymentYES += parseInt(e.price)
            }
          }
          if (String(pricePaymentYES) === e.priceday) {
            newListFactorSortByPayments.push(e)
          }
        }
        //sort by number lasted factor
        let selectFactorNumber = newListFactorSortByPayments.length - 1
        if (titleC === "برنزی") {
          selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPersonsuport.sucbronzeN))
        }
        if (titleC === "نقره ای") {
          selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPersonsuport.sucsilverN))
        }
        const facrotSelected = newListFactorSortByPayments[selectFactorNumber]
        if (facrotSelected !== undefined) {
          const DateFacrotSelected = new Date(facrotSelected.editAt.getFullYear(), facrotSelected.editAt.getMonth() + 3, facrotSelected.editAt.getDate(), facrotSelected.editAt.getHours())
          const nowDate = new Date()
          if (DateFacrotSelected < nowDate) {
            if (titleC === "برنزی") {
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: rewardPersonsuport.sucsilverN,
                sucbronzeN: "0",
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            }
            if (titleC === "نقره ای") {
              const rewardPersonData = {
                personalid: suportid,
                sucsilverN: "0",
                sucbronzeN: rewardPersonsuport.sucbronzeN,
                vipsilverN: rewardPersonsuport.vipsilverN,
                vipgoldenN: rewardPersonsuport.vipgoldenN,
                vipdiamondN: rewardPersonsuport.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPersonsuport.id,
                rewardPersonData
              );
            }
          }
        }
      }
      if (titleG === "vip") {
        const listFactorSuperviser = await Factor.find({
          supervisorid,
        })
        //sort by class and group id  
        const newListSortByTGC = []
        for (let i = 0; i < listFactorSuperviser.length; i++) {
          const e = listFactorSuperviser[i];
          if (String(sbyidFactor.courseid) === String(e.courseid)) {
            newListSortByTGC.push(e)
          }
        }
        //sort by payment final
        const newListFactorSortByPayments = []
        for (let i = 0; i < newListSortByTGC.length; i++) {
          const e = newListSortByTGC[i];
          const Ie = e.installments
          let pricePaymentYES = 0
          for (let j = 0; j < Ie.length; j++) {
            const e = Ie[j];
            if (e.payment === "yes") {
              pricePaymentYES += parseInt(e.price)
            }
          }
          if (String(pricePaymentYES) === e.priceday) {
            newListFactorSortByPayments.push(e)
          }
        }
        //sort by number lasted factor
        let selectFactorNumber = newListFactorSortByPayments.length - 1
        if (titleC === "نقره ای") {
          selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPerson.vipsilverN))
        }
        if (titleC === "طلایی") {
          selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPerson.vipgoldenN))
        }
        if (titleC === "الماسی") {
          selectFactorNumber = String(newListFactorSortByPayments.length - parseInt(rewardPerson.vipdiamondN))
        }
        const facrotSelected = newListFactorSortByPayments[selectFactorNumber]
        if (facrotSelected !== undefined) {
          const DateFacrotSelected = new Date(facrotSelected.editAt.getFullYear(), facrotSelected.editAt.getMonth() + 3, facrotSelected.editAt.getDate(), facrotSelected.editAt.getHours())
          const nowDate = new Date()
          if (DateFacrotSelected < nowDate) {
            if (titleC === "نقره ای") {
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: "0",
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            }
            if (titleC === "طلایی") {
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: "0",
                vipdiamondN: rewardPerson.vipdiamondN,
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            }
            if (titleC === "الماسی") {
              const rewardPersonData = {
                personalid: supervisorid,
                sucsilverN: rewardPerson.sucsilverN,
                sucbronzeN: rewardPerson.sucbronzeN,
                vipsilverN: rewardPerson.vipsilverN,
                vipgoldenN: rewardPerson.vipgoldenN,
                vipdiamondN: "0",
              };
              await RewardPerson.findByIdAndUpdate(
                rewardPerson.id,
                rewardPersonData
              );
            }
          }
        }
      }


      switch (titleG) {
        case "راه موفقیت":
          switch (titleC) {
            case "برنزی":
              if ((parseInt(rewardPersonsuport.sucbronzeN) + 1) === parseInt(reward.sucbronzeN)) {
                rewardPersonsuport.sucbronzeN = String(
                  parseInt(rewardPersonsuport.sucbronzeN) + 1
                );
                suport2.salary = String(
                  parseInt(suport2.salary) +
                  parseInt(reward.sucbronzeP)
                );
                const giftData = {
                  personalid: suportid,
                  title: `${titleG}-${titleC}-1`,
                  price: reward.sucbronzeP,

                  smunber: reward.sucbronzeN,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: suportid,
                  sucsilverN: rewardPersonsuport.sucsilverN,
                  sucbronzeN: rewardPersonsuport.sucbronzeN,
                  vipsilverN: rewardPersonsuport.vipsilverN,
                  vipgoldenN: rewardPersonsuport.vipgoldenN,
                  vipdiamondN: rewardPersonsuport.vipdiamondN,
                };
                const supervisorData = {
                  salary: suport2.salary,
                };
                await Personal.findByIdAndUpdate(suportid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPersonsuport.id,
                  rewardPersonData
                );
              } else if ((parseInt(rewardPersonsuport.sucbronzeN) + 1) === parseInt(reward.sucbronzeN2)) {
                rewardPersonsuport.sucbronzeN = "0";
                suport2.salary = String(
                  parseInt(suport2.salary) +
                  parseInt(reward.sucbronzeP2)
                );
                const giftData = {
                  personalid: suportid,
                  title: `${titleG}-${titleC}-2`,
                  price: reward.sucbronzeP2,

                  smunber: reward.sucbronzeN2,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: suportid,
                  sucsilverN: rewardPersonsuport.sucsilverN,
                  sucbronzeN: rewardPersonsuport.sucbronzeN,
                  vipsilverN: rewardPersonsuport.vipsilverN,
                  vipgoldenN: rewardPersonsuport.vipgoldenN,
                  vipdiamondN: rewardPersonsuport.vipdiamondN,
                };
                const supervisorData = {
                  salary: suport2.salary,
                };
                await Personal.findByIdAndUpdate(suportid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPersonsuport.id,
                  rewardPersonData
                );
              } else {
                rewardPersonsuport.sucbronzeN = String(
                  parseInt(rewardPersonsuport.sucbronzeN) + 1
                );
                const rewardPersonData = {
                  personalid: suportid,
                  sucsilverN: rewardPersonsuport.sucsilverN,
                  sucbronzeN: rewardPersonsuport.sucbronzeN,
                  vipsilverN: rewardPersonsuport.vipsilverN,
                  vipgoldenN: rewardPersonsuport.vipgoldenN,
                  vipdiamondN: rewardPersonsuport.vipdiamondN,
                };
                await RewardPerson.findByIdAndUpdate(
                  rewardPersonsuport.id,
                  rewardPersonData
                );
              }
              break;
            case "نقره ای":
              if ((parseInt(rewardPersonsuport.sucsilverN) + 1) === parseInt(reward.sucsilverN)) {
                rewardPersonsuport.sucsilverN = String(
                  parseInt(rewardPersonsuport.sucsilverN) + 1
                );
                suport2.salary = String(
                  parseInt(suport2.salary) +
                  parseInt(reward.sucsilverP)
                );
                const giftData = {
                  personalid: suportid,
                  title: `${titleG}-${titleC}-1`,
                  price: reward.sucsilverP,

                  smunber: reward.sucsilverN,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: suportid,
                  sucsilverN: rewardPersonsuport.sucsilverN,
                  sucbronzeN: rewardPersonsuport.sucbronzeN,
                  vipsilverN: rewardPersonsuport.vipsilverN,
                  vipgoldenN: rewardPersonsuport.vipgoldenN,
                  vipdiamondN: rewardPersonsuport.vipdiamondN,
                };
                const supervisorData = {
                  salary: suport2.salary,
                };
                await Personal.findByIdAndUpdate(suportid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPersonsuport.id,
                  rewardPersonData
                );
              } else if ((parseInt(rewardPersonsuport.sucsilverN) + 1) === parseInt(reward.sucsilverN2)) {
                rewardPersonsuport.sucsilverN = "0";
                suport2.salary = String(
                  parseInt(suport2.salary) +
                  parseInt(reward.sucsilverP2)
                );
                const giftData = {
                  personalid: suportid,
                  title: `${titleG}-${titleC}-2`,
                  price: reward.sucsilverP2,

                  smunber: reward.sucsilverN2,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: suportid,
                  sucsilverN: rewardPersonsuport.sucsilverN,
                  sucbronzeN: rewardPersonsuport.sucbronzeN,
                  vipsilverN: rewardPersonsuport.vipsilverN,
                  vipgoldenN: rewardPersonsuport.vipgoldenN,
                  vipdiamondN: rewardPersonsuport.vipdiamondN,
                };
                const supervisorData = {
                  salary: suport2.salary,
                };
                await Personal.findByIdAndUpdate(suportid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPersonsuport.id,
                  rewardPersonData
                );
              } else {
                rewardPersonsuport.sucsilverN = String(
                  parseInt(rewardPersonsuport.sucsilverN) + 1
                );
                const rewardPersonData = {
                  personalid: suportid,
                  sucsilverN: rewardPersonsuport.sucsilverN,
                  sucbronzeN: rewardPersonsuport.sucbronzeN,
                  vipsilverN: rewardPersonsuport.vipsilverN,
                  vipgoldenN: rewardPersonsuport.vipgoldenN,
                  vipdiamondN: rewardPersonsuport.vipdiamondN,
                };
                await RewardPerson.findByIdAndUpdate(
                  rewardPersonsuport.id,
                  rewardPersonData
                );
              }
              break;
            default:
              break;
          }
          break;
        case "vip":
          switch (titleC) {
            case "نقره ای":
              if ((parseInt(rewardPerson.sucsilverN) + 1) === parseInt(reward.sucsilverN)) {
                rewardPerson.vipsilverN = "0";
                supervisor2.salary = String(
                  parseInt(supervisor2.salary) +
                  parseInt(reward.vipsilverP)
                );
                const giftData = {
                  personalid: supervisorid,
                  title: `${titleG}-${titleC}-1`,
                  price: reward.vipsilverP,

                  smunber: reward.vipsilverN,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                const supervisorData = {
                  salary: supervisor2.salary,
                };
                await Personal.findByIdAndUpdate(supervisorid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              } else {
                rewardPerson.vipsilverN = String(
                  parseInt(rewardPerson.vipsilverN) + 1
                );
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              }
              break;
            case "طلایی":
              if ((parseInt(rewardPerson.vipgoldenN) + 1) === parseInt(reward.vipgoldenN)) {
                rewardPerson.vipgoldenN = "0";
                supervisor2.salary = String(
                  parseInt(supervisor2.salary) +
                  parseInt(reward.vipgoldenP)
                );
                const giftData = {
                  personalid: supervisorid,
                  title: `${titleG}-${titleC}-1`,
                  price: reward.vipgoldenP,

                  smunber: reward.vipgoldenN,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                const supervisorData = {
                  salary: supervisor2.salary,
                };
                await Personal.findByIdAndUpdate(supervisorid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              } else {
                rewardPerson.vipgoldenN = String(
                  parseInt(rewardPerson.vipgoldenN) + 1
                );
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              }
              break;
            case "الماسی":
              if ((parseInt(rewardPerson.vipdiamondN) + 1) === parseInt(reward.vipdiamondN)) {
                rewardPerson.vipdiamondN = String(
                  parseInt(rewardPerson.vipdiamondN) + 1
                );
                supervisor2.salary = String(
                  parseInt(supervisor2.salary) +
                  parseInt(reward.vipdiamondP)
                );
                const giftData = {
                  personalid: supervisorid,
                  title: `${titleG}-${titleC}-1`,
                  price: reward.vipdiamondP,

                  smunber: reward.vipdiamondN,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                const supervisorData = {
                  salary: supervisor2.salary,
                };
                await Personal.findByIdAndUpdate(supervisorid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              } else if ((parseInt(rewardPerson.vipdiamondN) + 1) === parseInt(reward.vipdiamondN2)) {
                rewardPerson.vipdiamondN = String(
                  parseInt(rewardPerson.vipdiamondN) + 1
                );
                supervisor2.salary = String(
                  parseInt(supervisor2.salary) +
                  parseInt(reward.vipdiamondP2)
                );
                const giftData = {
                  personalid: supervisorid,
                  title: `${titleG}-${titleC}-2`,
                  price: reward.vipdiamondP2,

                  smunber: reward.vipdiamondN2,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                const supervisorData = {
                  salary: supervisor2.salary,
                };
                await Personal.findByIdAndUpdate(supervisorid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              } else if ((parseInt(rewardPerson.vipdiamondN) + 1) === parseInt(reward.vipdiamondN3)) {
                rewardPerson.vipdiamondN = "0";
                supervisor2.salary = String(
                  parseInt(supervisor2.salary) +
                  parseInt(reward.vipdiamondP3)
                );
                const giftData = {
                  personalid: supervisorid,
                  title: `${titleG}-${titleC}-3`,
                  price: reward.vipdiamondP3,

                  smunber: reward.vipdiamondN3,
                }
                await Gift.giftValid(giftData)
                await Gift.create(giftData)
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                const supervisorData = {
                  salary: supervisor2.salary,
                };
                await Personal.findByIdAndUpdate(supervisorid, supervisorData);
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              } else {
                rewardPerson.vipdiamondN = String(
                  parseInt(rewardPerson.vipdiamondN) + 1
                );
                const rewardPersonData = {
                  personalid: supervisorid,
                  sucsilverN: rewardPerson.sucsilverN,
                  sucbronzeN: rewardPerson.sucbronzeN,
                  vipsilverN: rewardPerson.vipsilverN,
                  vipgoldenN: rewardPerson.vipgoldenN,
                  vipdiamondN: rewardPerson.vipdiamondN,
                };
                await RewardPerson.findByIdAndUpdate(
                  rewardPerson.id,
                  rewardPersonData
                );
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }


    //search Group and Type
    const course = await Course.findById(sbyidFactor.courseid);
    const sbyidGroup = await Group.findById(course.groupid);
    const sbyidType = await Type.findById(course.typeid);
    // add super and suport
    const supervisor = await Personal.findById(sbyidFactor.supervisorid);
    const suport = await Personal.findById(sbyidFactor.suportid);

    if (supervisor.id === suport.id) {
      // 100% superviser == suporter
      const superviser = percent * 1 * 0.1;
      if (percent > 0) {
        supervisor.salary = String(parseInt(supervisor.salary) + superviser);
        const datasuperviser = {
          number: supervisor.number,
          name: supervisor.name,
          lastname: supervisor.lastname,
          melicode: supervisor.melicode,
          salary: supervisor.salary,
        };
        await Personal.personalValid(datasuperviser);
        await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);

        const dataSuperviser = {
          personid: supervisor.id,
          salary: String(superviser),
          courseid: course.id,
          factorid: id,
        };
        await Sal.salaryValid(dataSuperviser);
        await Sal.create(dataSuperviser);
      }
      //create factor
      const data = {
        priceday: sbyidFactor.priceday,
        courseid: sbyidFactor.courseid,
        studentid: sbyidFactor.studentid,
        supervisorid: sbyidFactor.supervisorid,
        suportid: sbyidFactor.suportid,
        numberinstallment,
        installments: installmentsFixDate,
        editAt: new Date(),
        offer: sbyidFactor.offer
      };
      await Factor.factorValid(data);
      await Factor.findByIdAndUpdate(id, data);
      //response
      return res.status(200).json({ message: "فاکتور با موفقیت ویرایش شد" });
    } else {
      if (sbyidGroup.title === "راه موفقیت") {
        // 30% superviser 70% suporter
        const superviser = percent * 0.3 * 0.1;
        const suporter = percent * 0.7 * 0.1;
        if (percent > 0) {
          const dataSuperviser = {
            personid: supervisor.id,
            salary: String(superviser),
            courseid: course.id,
            factorid: id,
          };
          await Sal.salaryValid(dataSuperviser);
          await Sal.create(dataSuperviser);
          const dataSuporter = {
            personid: suport.id,
            salary: String(suporter),
            courseid: course.id,
            factorid: id,
          };
          await Sal.salaryValid(dataSuporter);
          await Sal.create(dataSuporter);
          // add salary datasuperviser 30%
          supervisor.salary = String(parseInt(supervisor.salary) + superviser);
          const datasuperviser = {
            number: supervisor.number,
            name: supervisor.name,
            lastname: supervisor.lastname,
            melicode: supervisor.melicode,
            salary: supervisor.salary,
          };
          await Personal.personalValid(datasuperviser);
          await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);
          // add salary suport 70%
          suport.salary = String(parseInt(suport.salary) + suporter);
          const datasuporter = {
            number: suport.number,
            name: suport.name,
            lastname: suport.lastname,
            melicode: suport.melicode,
            salary: suport.salary,
          };
          await Personal.personalValid(datasuporter);
          await Personal.findByIdAndUpdate(suport.id, datasuporter);
        }
        //create factor
        const data = {
          priceday: sbyidFactor.priceday,
          courseid: sbyidFactor.courseid,
          studentid: sbyidFactor.studentid,
          supervisorid: sbyidFactor.supervisorid,
          suportid: sbyidFactor.suportid,
          numberinstallment,
          installments: installmentsFixDate,
          editAt: new Date(),
          offer: sbyidFactor.offer
        };
        await Factor.factorValid(data);
        await Factor.findByIdAndUpdate(id, data);
        //response
        return res.status(200).json({ message: "فاکتور با موفقیت ویرایش شد" });
      }
      const findFacByStudent = await Factor.find({
        studentid: sbyidFactor.studentid,
      });

      var validVip = false;
      const arrFacByStudent = [];
      for (let i = 0; i < findFacByStudent.length; i++) {
        const e = findFacByStudent[i];
        const course = await Course.findById(e.courseid);
        const group = await Group.findById(course.groupid);
        const type = await Type.findById(course.typeid);
        if (group.title === "vip" && type.title === "مقدماتی") {
          validVip = true;
          arrFacByStudent.push(e);
        }
      }
      let validation = false;
      if (validVip) {
        if (arrFacByStudent[0].id === id) {
          validation = true;
        }
      }
      if (sbyidGroup.title === "vip") {
        if (validation) {
          // 70% supervisor & 30% support
          const superviser = percent * 0.7 * 0.1;
          const suporter = percent * 0.3 * 0.1;
          if (percent > 0) {
            const dataSuperviser = {
              personid: supervisor.id,
              salary: String(superviser),
              courseid: course.id,
              factorid: id,
            };
            await Sal.salaryValid(dataSuperviser);
            await Sal.create(dataSuperviser);
            const dataSuporter = {
              personid: suport.id,
              salary: String(suporter),
              courseid: course.id,
              factorid: id,
            };
            await Sal.salaryValid(dataSuporter);
            await Sal.create(dataSuporter);
            // add salary datasuperviser 30%
            supervisor.salary = String(parseInt(supervisor.salary) + superviser);
            const datasuperviser = {
              number: supervisor.number,
              name: supervisor.name,
              lastname: supervisor.lastname,
              melicode: supervisor.melicode,
              salary: supervisor.salary,
            };
            await Personal.personalValid(datasuperviser);
            await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);
            // add salary suport 70%
            suport.salary = String(parseInt(suport.salary) + suporter);
            const datasuporter = {
              number: suport.number,
              name: suport.name,
              lastname: suport.lastname,
              melicode: suport.melicode,
              salary: suport.salary,
            };
            await Personal.personalValid(datasuporter);
            await Personal.findByIdAndUpdate(suport.id, datasuporter);
          }
          //create factor
          const data = {
            priceday: sbyidFactor.priceday,
            courseid: sbyidFactor.courseid,
            studentid: sbyidFactor.studentid,
            supervisorid: sbyidFactor.supervisorid,
            suportid: sbyidFactor.suportid,
            numberinstallment,
            installments: installmentsFixDate,
            editAt: new Date(),
            offer: sbyidFactor.offer
          };
          await Factor.factorValid(data);
          await Factor.findByIdAndUpdate(id, data);
          //response
          return res.status(200).json({ message: "فاکتور با موفقیت ویرایش شد" });
        }
        if (percent > 0) {
          const superviser = percent * 1 * 0.1;
          const dataSuperviser = {
            personid: supervisor.id,
            salary: String(superviser),
            courseid: course.id,
            factorid: id,
          };
          await Sal.salaryValid(dataSuperviser);
          await Sal.create(dataSuperviser);

          // add salary datasuperviser 100%
          supervisor.salary = String(parseInt(supervisor.salary) + superviser);
          const datasuperviser = {
            number: supervisor.number,
            name: supervisor.name,
            lastname: supervisor.lastname,
            melicode: supervisor.melicode,
            salary: supervisor.salary,
          };
          await Personal.personalValid(datasuperviser);
          await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);
        }
        //create factor
        const data = {
          priceday: sbyidFactor.priceday,
          courseid: sbyidFactor.courseid,
          studentid: sbyidFactor.studentid,
          supervisorid: sbyidFactor.supervisorid,
          suportid: sbyidFactor.suportid,
          numberinstallment,
          installments: installmentsFixDate,
          editAt: new Date(),
          offer: sbyidFactor.offer
        };
        await Factor.factorValid(data);
        await Factor.findByIdAndUpdate(id, data);
        //response
        return res.status(200).json({ message: "فاکتور با موفقیت ویرایش شد" });
      }
    }
  } catch (err) {
    return res.status(500).json({ err, message: "ERR 500" });
  }
};

exports.handleDeleteFactor = async (req, res, next) => {
  try {
    const { id, title } = req.body;
    const sbyidFactor = await Factor.findById(id);
    if (sbyidFactor === null) {
      return res.status(403).json({ message: "آیدی اشتباه میباشد" });
    }


    if (title === "v1") {
      await Factor.findByIdAndDelete(id);
      return res.status(200).json({ message: "حذف با موفقیت انجام شد" });
    }
    if (title === "v2") {
      // ids
      const factorSuperviserId = sbyidFactor.supervisorid
      const factorSuporterId = sbyidFactor.suportid
      const factorCourseId = await Course.findById(sbyidFactor.courseid)
      const groupBYID = await Group.findById(factorCourseId.groupid)
      const classBYID = await Classs.findById(factorCourseId.classid)
      const gTitel = groupBYID.title
      const cTitle = classBYID.title
      // reward
      const rew = await Reward.find();
      const reward = rew[0];
      //debug
      if (gTitel === "راه موفقیت") {
        const rewardPersonSuporter = await RewardPerson.findOne({ personalid: factorSuporterId })
        const personal = await Personal.findById(factorSuporterId)
        if (cTitle === "برنزی") {
          if (rewardPersonSuporter.sucbronzeN === reward.sucbronzeN) {
            const data = {
              salary: String(parseInt(personal.salary) - parseInt(reward.sucbronzeP)),
            };
            await Personal.findOneAndUpdate({ _id: personal.id }, data)
            rewardPersonSuporter.sucbronzeN = String(parseInt(rewardPersonSuporter.sucbronzeN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuporter.id, rewardPersonSuporter)
          } else if (rewardPersonSuporter.sucbronzeN === "0") {
            const data = {
              salary: String(parseInt(personal.salary) - parseInt(reward.sucbronzeP2)),
            };
            await Personal.findOneAndUpdate({ _id: personal.id }, data)
            rewardPersonSuporter.sucbronzeN = String(parseInt(reward.sucbronzeN2) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuporter.id, rewardPersonSuporter)
          } else {
            rewardPersonSuporter.sucbronzeN = String(parseInt(rewardPersonSuporter.sucbronzeN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuporter.id, rewardPersonSuporter)
          }
        }
        if (cTitle === "نقره ای") {
          if (rewardPersonSuporter.sucsilverN === reward.sucsilverN) {
            const data = {
              salary: String(parseInt(personal.salary) - parseInt(reward.sucsilverP)),
            };
            await Personal.findOneAndUpdate({ _id: personal.id }, data)
            rewardPersonSuporter.sucsilverN = String(parseInt(rewardPersonSuporter.sucsilverN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuporter.id, rewardPersonSuporter)
          } else if (rewardPersonSuporter.sucsilverN === "0") {
            const data = {
              salary: String(parseInt(personal.salary) - parseInt(reward.sucsilverP2)),
            };
            await Personal.findOneAndUpdate({ _id: personal.id }, data)
            rewardPersonSuporter.sucsilverN = String(parseInt(reward.sucsilverN2) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuporter.id, rewardPersonSuporter)
          } else {
            rewardPersonSuporter.sucsilverN = String(parseInt(rewardPersonSuporter.sucsilverN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuporter.id, rewardPersonSuporter)
          }
        }
      }
      if (gTitel === "vip") {
        const rewardPersonSuperviser = await RewardPerson.findOne({ personalid: factorSuperviserId })
        const person = await Personal.findById(factorSuperviserId)
        if (cTitle === "نقره ای") {
          if (rewardPersonSuperviser.vipsilverN === "0") {
            const data = {
              salary: String(parseInt(person.salary) - parseInt(reward.vipsilverP)),
            };
            await Personal.findByIdAndUpdate(factorSuperviserId, data)
            rewardPersonSuperviser.vipsilverN = String(parseInt(reward.vipsilverN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          } else {
            rewardPersonSuperviser.vipsilverN = String(parseInt(rewardPersonSuperviser.vipsilverN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          }
        }
        if (cTitle === "طلایی") {
          if (rewardPersonSuperviser.vipgoldenN === "0") {
            rewardPersonSuperviser.vipgoldenN = String(parseInt(reward.vipgoldenN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)

            const data = {
              salary: String(parseInt(person.salary) - parseInt(reward.vipgoldenP)),
            };
            await Personal.findByIdAndUpdate(factorSuperviserId, data)
          } else {
            rewardPersonSuperviser.vipgoldenN = String(parseInt(rewardPersonSuperviser.vipgoldenN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          }
        }
        if (cTitle === "الماسی") {
          if (rewardPersonSuperviser.vipdiamondN === reward.vipdiamondN) {
            const data = {
              salary: String(parseInt(person.salary) - parseInt(reward.vipdiamondP)),
            };
            await Personal.findByIdAndUpdate(factorSuperviserId, data)
            rewardPersonSuperviser.vipdiamondN = String(parseInt(rewardPersonSuperviser.vipdiamondN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          } else if (rewardPersonSuperviser.vipdiamondN === reward.vipdiamondN2) {
            const data = {
              salary: String(parseInt(person.salary) - parseInt(reward.vipdiamondP2)),
            };
            await Personal.findByIdAndUpdate(factorSuperviserId, data)
            rewardPersonSuperviser.vipdiamondN = String(parseInt(reward.vipdiamondN2) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          } else if (rewardPersonSuperviser.vipdiamondN === "0") {
            const data = {
              salary: String(parseInt(person.salary) - parseInt(reward.vipdiamondP3)),
            };
            await Personal.findByIdAndUpdate(factorSuperviserId, data)
            rewardPersonSuperviser.vipdiamondN = String(parseInt(reward.vipdiamondN3) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          } else {
            rewardPersonSuperviser.vipdiamondN = String(parseInt(rewardPersonSuperviser.vipdiamondN) - 1)
            await RewardPerson.findByIdAndUpdate(rewardPersonSuperviser.id, rewardPersonSuperviser)
          }
        }
      }
      // add super and suport
      const supervisor = await Personal.findById(sbyidFactor.supervisorid);
      const suport = await Personal.findById(sbyidFactor.suportid);
      const saleSupervisor = await Sal.find({
        personid: sbyidFactor.supervisorid,
        factorid: id,
      });
      const saleSuport = await Sal.find({
        personid: sbyidFactor.suportid,
        factorid: id,
      });
      let amountSuperViser = 0;
      let amountSuporter = 0;
      for (let i = 0; i < saleSupervisor.length; i++) {
        const e = saleSupervisor[i];
        amountSuperViser += parseInt(e.salary);
        await Sal.findByIdAndDelete(e.id)
      }
      for (let i = 0; i < saleSuport.length; i++) {
        const e = saleSuport[i];
        amountSuporter += parseInt(e.salary);
        await Sal.findByIdAndDelete(e.id)
      }
      if (amountSuporter !== 0) {
        suport.salary = parseInt(suport.salary) - amountSuporter;
        const datasuperviser = {
          number: suport.number,
          name: suport.name,
          lastname: suport.lastname,
          melicode: suport.melicode,
          salary: suport.salary,
        };
        await Personal.personalValid(datasuperviser);
        await Personal.findByIdAndUpdate(suport.id, datasuperviser);
      }
      if (amountSuperViser !== 0) {
        supervisor.salary = parseInt(supervisor.salary) - amountSuperViser;
        const datasuperviser = {
          number: supervisor.number,
          name: supervisor.name,
          lastname: supervisor.lastname,
          melicode: supervisor.melicode,
          salary: supervisor.salary,
        };
        await Personal.personalValid(datasuperviser);
        await Personal.findByIdAndUpdate(supervisor.id, datasuperviser);
      }
      await Factor.findByIdAndDelete(id);
      return res.status(200).json({ message: "حذف با موفقیت انجام شد" });
    }
    return res.status(400).json({ message: "ورودی ها  اشتباه میباشند" });
  } catch (err) {
    return res.status(500).json({ err, message: "ERR 500" });
  }
};

exports.handleGetFactor = async (req, res, next) => {
  try {
    const { title } = req.body
    const skip = title * 20
    const allFactor = await Factor.find().skip(skip).limit(20);
    if (allFactor.length === 0) {
      return res.status(404).json({ message: "ERR 404" });
    }
    const allFactorForm = [];
    for (let i = 0; i < allFactor.length; i++) {
      const e = allFactor[i];
      const [r1, r2, r3, r4] = await Promise.allSettled([
        Course.findById(e.courseid),
        Student.findById(e.studentid),
        Personal.findById(e.supervisorid),
        Personal.findById(e.suportid)
      ]);
      const course = r1.value
      const student = r2.value
      const supervisor = r3.value
      const suport = r4.value
      const VC = classe.filter(item => {
        if (item._id.toString() === course.classid.toString()) {
          return item
        }
      })
      const VG = groups.filter(item => {
        if (item._id.toString() === course.groupid.toString()) {
          return item
        }
      })
      const VT = types.filter(item => {
        if (item._id.toString() === course.typeid.toString()) {
          return item
        }
      })
      const data = {
        _id: e.id,
        course: {
          _id: course.id,
          name: course.name,
          price: course.price,
          type: VT[0],
          class: VC[0],
          group: VG[0],
        },
        student,
        supervisor,
        suport,
        numberinstallment: e.numberinstallment,
        priceday: e.priceday,
        installments: e.installments,
        offer: e.offer,
        createdAt: e.createdAt,
        editAt: e.editAt
      };
      allFactorForm.push(data);
    }
    return res
      .status(200)
      .json({ data: allFactorForm, message: "داده ها با موفقیت ارسال شد" });
  } catch (err) {
    return res.status(500).json({ err, message: "ERR 500" });
  }
};
