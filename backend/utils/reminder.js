const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Card = require("../model/card");
const Profile = require("../model/profile");
const ProfileCard = require("../model/profileCard");
const User = require("../model/user");

const getProfiles = async () => {
  const data = [];
  const profiles = await Profile.find({ reminder: true });
  //one profile can have many profilecard
  for (const profile of profiles) {
    const profileCards = await ProfileCard.find({ profileId: profile._id });
    for (const profileCard of profileCards) {
      const card = await Card.findById(profileCard.cardId);
      if (card.outstandingAmount > 0) {
        const user = await User.findById(profile.userId);
        data.push({
          email: user.email,
          outstandingAmount: card.outstandingAmount,
          cardNumber: card.cardNumber,
        });
      }
    }
  }

  return data;
};

const addDays = (date, days) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

const reminder = async () => {
  const remData = await getProfiles();

  let todayDate = new Date();

  const afterFiveDaysDate = addDays(todayDate, 5);

  const date1 = todayDate.getDate();
  const date2 = afterFiveDaysDate.getDate();

  if (date2 < date1) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secureConnection: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        minDHSize: 512,
        minVersion: "TLSv1",
        maxVersion: "TLSv1.3",
        ciphers: "ALL",
      },
      logger: true,
      debug: true,
    });

    cron.schedule(
      "0 0 8 27 * *",
      async function () {
        for (const data of remData) {
          const mailOptions = {
            from: "no-reply@example.com",
            to: data.email,
            subject: "Pay your outstanding amount",
            text: `Hi cred user, You have an outstanding amount ${data.outstandingAmount} remaining to pay against card - ${data.cardNumber}.\nPay before the end of this month to earn rewards.`,
          };
          try {
            await transporter.sendMail(mailOptions);
          } catch (error) {
            console.error("Error in cron job:", error);
          }
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );
  }
};

module.exports = reminder;
