const bigPromise = require("../middleware/bigPromise");
const Card = require("../model/card");
const Profile = require("../model/profile");
const ProfileCard = require("../model/profileCard");
const CustomError = require("../utils/customError");

exports.addCard = bigPromise(async (req, res, next) => {
  try {
    await Card.validate(req.body);

    const {
      authCode,
      cardOwnerName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
    } = req.body;

    // const hashedCardNumber = encrypt(cardNumber);

    // const allCards = await Card.find({}).populate("");

    // if there is not authCode in req (Authcode = N)
    if (authCode === undefined) {
      // If Card alreday exist (Card = T)
      const existingCard = await Card.findOne({ cardNumber });
      if (existingCard) {
        const profileCard = await ProfileCard.findOne({
          cardId: existingCard._id,
        });
        const profile = await Profile.findOne({
          _id: profileCard.profileId,
        });

        // If added by same user (User = T)
        if (req.user._id.equals(profile.userId)) {
          next(new CustomError("Card is Already Added", 409));
        } else {
          //If not added by same user (User = F)
          console.log("Same User");
          next(
            new CustomError("You're are not authorised to add this card", 422)
          );
        }
      } else {
        // Card not exists

        const profileAssociated = await Profile.findOne({
          userId: req.user._id,
        });

        const card = await Card.create({
          cardOwnerName: cardOwnerName.toUpperCase(),
          cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
        });

        await ProfileCard.create({
          profileId: profileAssociated._id,
          cardId: card._id,
        });

        res.status(200).json({
          success: true,
          card,
        });
      }
    } else {
      //If there is authcode in req (Authcode = Y)

      const existingCard = await Card.findOne({ cardNumber });

      //If card exists
      if (existingCard) {
        const profileCard = await ProfileCard.findOne({
          cardId: existingCard._id,
        });
        const profile = await Profile.findOne({
          _id: profileCard.profileId,
        });
        // If added by same user (User = T)
        if (req.user._id.equals(profile.userId)) {
          next(new CustomError("Card is Already Added", 409));
        } else {
          //If not added by same user (User = F)
          //Then check for authCode & add Card
          if (authCode === profile.authCode) {
            if (
              existingCard.cardOwnerName === cardOwnerName.toUpperCase() &&
              existingCard.expiryMonth === expiryMonth &&
              existingCard.expiryYear === expiryYear &&
              existingCard.cvv === cvv
            ) {
              const currrentProfile = await Profile.findOne({
                userId: req.user._id,
              });

              //Add the card
              await ProfileCard.create({
                profileId: currrentProfile._id,
                cardId: existingCard._id,
              });

              res.status(200).json({
                success: true,
                existingCard,
              });
            } else {
              next(new CustomError("Information not Matching!", 422));
            }
          } else {
            next(new CustomError("Wrong Auth Code!", 422));
          }
        }
      } else {
        // Card not exists
        next(new CustomError("Wrong Card Details", 422));
      }
    }
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
});
