const mongoose = require("mongoose");
const bigPromise = require("../middleware/bigPromise");
const Card = require("../model/card");
const Profile = require("../model/profile");
const ProfileCard = require("../model/profileCard");
const Transaction = require("../model/transaction");
const CustomError = require("../utils/customError");

const daysInMonth = (month, year) => {
  const temp = new Date(year, month + 1, 0);
  return parseInt(temp.getDate());
};

const updateCoins = (initialCoins, amount) => {
  const today = new Date();
  const currentMonth = parseInt(today.getMonth());
  const currentYear = parseInt(today.getYear());
  const numberOfDays = daysInMonth(currentMonth, currentYear);
  const todayDate = parseInt(today.getDate());

  const daysRemaining = numberOfDays - todayDate;
  const slope = 0.05 / numberOfDays;
  const fraction = slope * daysRemaining;
  const coinsEarned = parseInt(fraction * parseInt(amount));
  const finalCoins = parseInt(initialCoins) + coinsEarned;
  // console.log(currentYear, currentMonth, numberOfDays, todayDate, daysRemaining, slope, fraction, coinsEarned, finalCoins);
  return finalCoins;
};

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

    const existingCard = await Card.findOne({ cardNumber });

    // if there is not authCode in req (Authcode = N)
    if (authCode === undefined) {
      // If Card alreday exist (Card = T)
      if (existingCard) {
        const profileCard = await ProfileCard.findOne({
          cardId: existingCard._id,
        });
        const profile = await Profile.findOne({
          _id: profileCard.profileId,
        });

        // If added by same user (User = T)
        if (req.user._id.equals(profile.userId)) {
          res.statusCode = 409;
          throw new Error("Card is Already Added");
        } else {
          //If not added by same user (User = F)
          res.statusCode = 422;
          throw new Error("You're are not authorised to add this card");
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
          res.statusCode = 409;
          throw new Error("Card is Already Added");
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
              res.statusCode = 422;
              throw new Error("Information not Matching!");
            }
          } else {
            res.statusCode = 422;
            throw new Error("Wrong Auth Code");
          }
        }
      } else {
        res.statusCode = 422;
        throw new Error("Wrong Card Details");
      }
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const firstError = Object.values(error.errors)[0];
      res.statusCode = 422;
      next(firstError);
    } else {
      next(error);
    }
  }
});

exports.getAllCards = bigPromise(async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    const profileCards = await ProfileCard.find({ profileId: profile._id });
    if (!profileCards || profileCards.length === 0) {
      return res.status(200).json({ success: true, cards: [] });
    }
    // Extract card ids from profile cards
    const cardIds = profileCards.map((profileCard) => profileCard.cardId);

    // Find all cards using the extracted card ids
    const cards = await Card.find({ _id: { $in: cardIds } });
    res.status(200).json({ success: true, cards });
  } catch (error) {
    next(error);
  }
});

exports.getCardById = bigPromise(async (req, res, next) => {
  try {
    // Retrieve the card details
    const card = await Card.findById(req.params.card_id);

    if (!card) {
      res.statusCode = 404;
      throw new Error("Card not found");
    }

    // Finding all profiles associated with the card
    const profileAssociated = await ProfileCard.find({
      cardId: req.params.card_id,
    }).populate("profileId");

    // Check if the card is associated with the logged-in user
    const associatedUserIds = profileAssociated.map((profile) =>
      profile.profileId.userId.toString()
    );

    if (!associatedUserIds.includes(req.user._id.toString())) {
      res.statusCode = 404;
      throw new Error("You're not authorized to access this card");
    }

    // Send response with card information
    res.status(200).json({ success: true, card });
  } catch (error) {
    next(error);
  }
});

exports.payBill = bigPromise(async (req, res, next) => {
  try {
    const { amount } = req.body;
    // Get Profile: Retrieves the profile information associated with the currently logged-in user from the database.
    const profile = await Profile.findOne({ userId: req.user._id });

    const coinCount = updateCoins(profile.coins, amount);

    // Get User's Cards: Retrieves all the card IDs associated with the user's profile.
    const profileCards = await ProfileCard.find({ profileId: profile._id });

    if (!profileCards || profileCards.length === 0) {
      res.statusCode = 404;
      throw new Error("No cards associated with the user");
    }

    // Loop Through Cards: For each card associated with the user:
    for (const profileCard of profileCards) {
      // Fetch the card details from the database.
      const card = await Card.findById(profileCard.cardId);

      // If the requested card number matches the card number:
      // Assuming the requested card number is provided in the request body as 'cardNumber'
      if (req.params.cardNumber === card.cardNumber) {
        // Update the user's coin count in the profile.
        // Assuming the coins are deducted for the bill payment
        profile.coins = coinCount;
        card.outstandingAmount -= amount;
        await profile.save();
        await card.save();

        // Create a new transaction record with transaction details.
        const transaction = new Transaction({
          amount,
          vendor: "NA",
          type: "credit",
          category: "NA",
          cardNumber: card.cardNumber,
          transactionDateTime: Date.now(),
          cardId: profileCard.cardId,
          userAssociated: req.user.email,
        });
        await transaction.save();
        // Send the transaction information in the response.
        return res.status(200).json({ success: true, transaction });
      }
    }

    // Handle Not Found: If no matching card is found
    res.statusCode = 404;
    throw new Error("Requested card not found");
  } catch (error) {
    next(error);
  }
});

exports.getAllStatements = bigPromise(async (req, res, next) => {

  try {
    // Get Profile: Retrieves the profile associated with the currently logged-in user from the database.
    const profile = await Profile.findOne({ userId: req.user._id });

    // Get Card IDs: Retrieves all the card IDs associated with the user's profile.
    const profileCards = await ProfileCard.find({ profileId: profile._id });

    if (!profileCards || profileCards.length === 0) {
      res.statusCode = 404;
      throw new Error("No cards associated with the user");
    }

    // Array to store all transactions
    let allTransactions = [];

    // Loop Through Cards: For each card associated with the user:
    for (const profileCard of profileCards) {
      // Fetches the card details from the database.
      const card = await Card.findById(profileCard.cardId);

      // Assuming the card number is provided in the request parameters as 'cardNumber'
      if (req.params.cardNumber == card.cardNumber) {
        // Retrieve Statements: If a matching card is found:
        // Fetches all transactions associated with that card from the database.
        const transactions = await Transaction.find({ cardId: card._id })
          .select("-cardId -cardNumber") // Specifies the attributes to be retrieved for each transaction except card ID
          .sort({ transactionDateTime: 1 }); // Sorts the transactions based on their transaction date and time in ascending order

        // Add transactions to the array of all transactions
        allTransactions = allTransactions.concat(transactions);
      }
    }

    // If no transactions found for the provided card number
    if (allTransactions.length === 0) {
      res.statusCode = 404;
      throw new Error("No transactions found for the provided card number");
    }

    // Send the sorted list of transactions as a response.
    res.status(200).json({ success: true, transactions: allTransactions });
  } catch (error) {
    next(error);
  }
});

exports.getStatementsYearMonth = bigPromise(async (req, res, next) => {
  try {
    // Extract Year and Month: Extracts the year and month from the request parameters and converts them into JavaScript Date objects.
    const { year, month, cardNumber } = req.params;
    const startingDate = new Date(year, month - 1, 1);
    const endingDate = new Date(year, month, 0);

    // Retrieve User Profile: Fetches the profile associated with the currently logged-in user from the database.
    const profile = await Profile.findOne({ userId: req.user._id });

    // Retrieve Card IDs: Fetches all the card IDs associated with the user's profile.
    const profileCards = await ProfileCard.find({ profileId: profile._id });

    if (!profileCards || profileCards.length === 0) {
      res.statusCode = 404;
      throw new Error("No cards associated with the user");
    }

    // Array to store all transactions
    let allTransactions = [];

    // Loop Through Cards: For each card associated with the user:
    for (const profileCard of profileCards) {
      // Fetches the card details from the database.
      const card = await Card.findById(profileCard.cardId);

      // Checks if the decrypted card number matches the card number provided in the request parameters.
      if (req.params.cardNumber === card.cardNumber) {
        // Retrieve Statements for Specified Period: If a matching card is found:
        // Fetches all transactions associated with that card and falling within the specified period (between the starting and ending dates).
        const statements = await Transaction.find({
          cardId: card._id,
          transactionDateTime: { $gte: startingDate, $lte: endingDate },
        })
          .select("-cardId -cardNumber")
          .sort({ transactionDateTime: 1 });

        allTransactions = allTransactions.concat(statements);
      }
    }

    // If no transactions found for the provided card number
    if (allTransactions.length === 0) {
      res.statusCode = 404;
      throw new Error("No transactions found for the provided card number");
    }

    // Pagination:
    allTransactions.reverse();
    const perPage = 10;
    const page = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
    const totalStatements = allTransactions.length;
    const totalPages = Math.ceil(totalStatements / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalStatements);
    const currentStatements = allTransactions.slice(startIndex, endIndex);

    // Send the current page of statements along with pagination details as a JSON response.
    return res.status(200).json({
      data: currentStatements,
      pages: totalPages,
      page,
    });
  } catch (error) {
    next(error);
  }
});

exports.postStatements = bigPromise(async (req, res, next) => {
  try {
    // Check Request Body
    if (!req.body.statements || req.body.statements.length === 0) {
      res.statusCode = 404;
      throw new Error("Please enter at least one statement");
    }

    // Extract Card Number, Year, and Month
    const { cardNumber, year, month } = req.params;
    const startingDate = new Date(year, month - 1, 1);

    // Retrieve All Cards
    const cards = await Card.find({});

    // Loop Through Cards
    for (const card of cards) {
      if (card.cardNumber === cardNumber) {
        // If a matching card is found, iterate through each statement in the request body
        for (const statement of req.body.statements) {
          // Create a new transaction record in the database
          const transaction = new Transaction({
            amount: statement.amount,
            vendor: statement.vendor.toUpperCase(),
            category: statement.category,
            type: statement.type,
            cardNumber: card.cardNumber,
            transactionDateTime: startingDate,
            userAssociated: "NA",
            cardId: card._id,
          });

          card.outstandingAmount += statement.amount;

          // Save the transaction record
          await transaction.save();
          await card.save();
        }

        // If transactions are successfully posted, send a success message with a status code of 200
        return res
          .status(200)
          .json({ success: true, message: "Statements posted successfully" });
      }
    }

    // If no matching card is found, throw an error
    res.statusCode = 404;
    throw new Error("Requested card not found");
  } catch (error) {
    // Handle Errors
    next(error);
  }
});

exports.getSmartStatementData = bigPromise(async (req, res, next) => {
  try {
    // Get Profile: Retrieves the profile associated with the currently logged-in user from the database.
    const profile = await Profile.findOne({ userId: req.user._id });

    // Get Card IDs: Retrieves all the card IDs associated with the user's profile.
    const profileCards = await ProfileCard.find({ profileId: profile._id });

    // Initialize variables to store unique categories and vendors
    const uniqueCategories = new Set();
    const uniqueVendors = new Set();

    // Initialize objects to store total amounts spent on categories and vendors
    const categoryTotalAmounts = {};
    const vendorTotalAmounts = {};

    // Loop Through Cards: For each card associated with the user:
    for (const profileCard of profileCards) {
      // Fetches the card details from the database.
      const card = await Card.findById(profileCard.cardId);

      // Retrieve Statements: If a matching card is found:
      if (req.params.cardNumber === card.cardNumber) {
        // Fetches all transactions associated with that card from the database.
        const statements = await Transaction.find({
          cardId: card._id,
        });

        if (statements.length === 0) {
          // return res.status(200).json({
          //   success: true,
          //   message: "No transactions found for the specified period",
          // });
          res.statusCode = 404;
          throw new Error("No transactions found for the specified period");
        }

        // Loop through all the retrieved statements
        for (const statement of statements) {
          // Extract Unique Categories and Vendors
          uniqueCategories.add(statement.category);
          uniqueVendors.add(statement.vendor);

          // Calculate Total Amounts for Categories and Vendors
          if (categoryTotalAmounts[statement.category]) {
            categoryTotalAmounts[statement.category] += statement.amount;
          } else {
            categoryTotalAmounts[statement.category] = statement.amount;
          }

          if (vendorTotalAmounts[statement.vendor]) {
            vendorTotalAmounts[statement.vendor] += statement.amount;
          } else {
            vendorTotalAmounts[statement.vendor] = statement.amount;
          }
        }
      }
    }

    // Format Data for Categories and Vendors
    const formattedCategoryData = Array.from(uniqueCategories).map(
      (category) => ({
        label: category,
        data: categoryTotalAmounts[category] || 0,
      })
    );

    const formattedVendorData = Array.from(uniqueVendors).map((vendor) => ({
      label: vendor,
      data: vendorTotalAmounts[vendor] || 0,
    }));

    // Create Smart Statement Object
    const smartStatementData = {
      categories: formattedCategoryData,
      vendors: formattedVendorData,
    };

    // Send Response
    res.status(200).json({ success: true, data: smartStatementData });
  } catch (error) {
    // Handle Not Found
    next(error);
  }
});

exports.getSmartStatementYearMonth = bigPromise(async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const startingDate = new Date(year, month - 1, 1);
    const endingDate = new Date(year, month, 0);

    // Get Profile: Retrieves the profile associated with the currently logged-in user from the database.
    const profile = await Profile.findOne({ userId: req.user._id });

    // Get Card IDs: Retrieves all the card IDs associated with the user's profile.
    const profileCards = await ProfileCard.find({ profileId: profile._id });

    // Initialize variables to store unique categories and vendors
    const uniqueCategories = new Set();
    const uniqueVendors = new Set();

    // Initialize objects to store total amounts spent on categories and vendors
    const categoryTotalAmounts = {};
    const vendorTotalAmounts = {};

    // Loop Through Cards: For each card associated with the user:
    for (const profileCard of profileCards) {
      // Fetches the card details from the database.
      const card = await Card.findById(profileCard.cardId);

      // Retrieve Statements: If a matching card is found:
      if (req.params.cardNumber === card.cardNumber) {
        // Fetches all transactions associated with that card from the database.
        const statements = await Transaction.find({
          cardId: card._id,
          transactionDateTime: { $gte: startingDate, $lte: endingDate },
        });

        if (statements.length === 0) {
          res.statusCode = 404;
          throw new Error("No transactions found for the specified period");
        }

        // Loop through all the retrieved statements
        for (const statement of statements) {
          // Extract Unique Categories and Vendors
          uniqueCategories.add(statement.category);
          uniqueVendors.add(statement.vendor);

          // Calculate Total Amounts for Categories and Vendors
          if (categoryTotalAmounts[statement.category]) {
            categoryTotalAmounts[statement.category] += statement.amount;
          } else {
            categoryTotalAmounts[statement.category] = statement.amount;
          }

          if (vendorTotalAmounts[statement.vendor]) {
            vendorTotalAmounts[statement.vendor] += statement.amount;
          } else {
            vendorTotalAmounts[statement.vendor] = statement.amount;
          }
        }
      }
    }

    // Format Data for Categories and Vendors
    const formattedCategoryData = Array.from(uniqueCategories).map(
      (category) => ({
        label: category,
        data: categoryTotalAmounts[category] || 0,
      })
    );

    const formattedVendorData = Array.from(uniqueVendors).map((vendor) => ({
      label: vendor,
      data: vendorTotalAmounts[vendor] || 0,
    }));

    // Create Smart Statement Object
    const smartStatementData = {
      categories: formattedCategoryData,
      vendors: formattedVendorData,
    };

    // Send Response
    res.status(200).json({ success: true, data: smartStatementData });
  } catch (error) {
    // Handle Not Found
    next(error);
  }
});
