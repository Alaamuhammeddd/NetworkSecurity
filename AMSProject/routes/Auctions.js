const router = require("express").Router();
const conn = require("../db/dbConnection");

const seller = require("../middleware/seller");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadimages");
const util = require("util"); //helper
const fs = require("fs");
const bidder = require("../middleware/bidder");
const { Router } = require("express");
const moment = require("moment");
require("dotenv").config();
const VerifyJWT = require("../middleware/VerifyJWT");
const { verify } = require("crypto");

// /////function koky w youstena

/// ///show all auction by id
router.get(
  "/auctionbyID/:auction_id",
  VerifyJWT,

  async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const auctionByID = await query(
      "select * from auctions where auction_id = ?",
      [req.params.auction_id]
    );
    auctionByID.map((auctionByID) => {
      auctionByID.image_url =
        "http://" + req.hostname + ":4000/" + auctionByID.image_url;
    });

    res.status(200).json(auctionByID);
  }
);

//Seller [CREATE AUCTIONS]

router.post(
  "/create",
  VerifyJWT,
  seller,
  upload.single("image"),
  body("auction_name")
    .isString()
    .withMessage("please Enter a Valid auction name")
    .isLength({ min: 3, max: 20 })
    .withMessage("name Should be between(3-20)Character"),
  body("description")
    .isString()
    .withMessage("please Enter a Valid auction description")
    .isLength({ min: 8 })
    .withMessage("name Should be at least 8 Characters"),
  body("category_name")
    .isString()
    .withMessage("please Entr a Valid category name")
    .isLength({ min: 4 })
    .withMessage("name Should be at least 4 Character"),
  body("start_date").isString(),
  body("end_date").isString(),
  async (req, res) => {
    try {
      // Validation for request with ,manual
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Validate the image
      if (!req.file) {
        return res.status(400).json({
          errors: [
            {
              msg: "Image is required !",
            },
          ],
        });
      }

      // Check maximum auctions limit for seller
      const queryCheckAuctions = util.promisify(conn.query).bind(conn);
      const sellerAuctions = await queryCheckAuctions(
        "SELECT COUNT(*) as count FROM auctions WHERE seller_id = ?",
        [req.user_id]
      );
      const sellerAuctionCount = sellerAuctions[0].count;
      if (sellerAuctionCount >= 10) {
        return res.status(400).json({
          errors: [
            {
              msg: "Maximum number of auctions reached for this seller",
            },
          ],
        });
      }

      // Prepare the object
      const auctionData = {
        auction_name: req.body.auction_name,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        image_url: req.file.filename,
        seller_id: req.user_id,
        category_name: req.body.category_name,
      };

      // Insert to database
      const query = util.promisify(conn.query).bind(conn);
      await query("insert into auctions set ?", auctionData);

      res.status(200).json({
        msg: "auction created successfully ! ",
      });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Seller [UPDATE AUCTIONS]
router.put(
  "/:auction_id", //prams
  seller,
  upload.single("image"),

  body("auction_name")
    .isString()
    .withMessage("please Entr a Valid auction name")
    .isLength({ min: 3, max: 20 })
    .withMessage("name Should be between(3-20)Character"),

  body("description")
    .isString()
    .withMessage("please Entr a Valid auction description")
    .isLength({ min: 8 })
    .withMessage("name Should be at least 8 Characters"),

  body("category_name")
    .isString()
    .withMessage("please Entr a Valid category name")
    .isLength({ min: 4 })
    .withMessage("name Should be at least 4 Character"),

  body("start_date").isString(),
  body("end_date").isString(),

  async (req, res) => {
    //1-Validation for request with ,manual
    const query = util.promisify(conn.query).bind(conn);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //2-CHECK IF AUCTION IS EXISTS OR NOT

    const auction = await query(
      "select * from auctions where auction_id  = ?",
      [req.params.auction_id]
    );
    // kda al auction m4 mwgod asln
    if (!auction[0]) {
      res.status(400).json({
        msg: "Auction NOT Found !",
      });
    }

    //3-PREPARE TO OBJECT
    const updatedAuction = {
      auction_name: req.body.auction_name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      category_name: req.body.category_name,
      seller_id: req.seller.user_id,
    };
    if (req.file) {
      updatedAuction.image_url = req.file.filename; //bya5od mny al image al gdyda
      //delete the old image
      fs.unlinkSync("./upload/" + auction[0].image_url);
    }

    //4- update auction in DB

    await query("update auctions set ? where auction_id = ?", [
      updatedAuction,
      auction[0].auction_id,
    ]);

    res.status(200).json({
      msg: "auction Updated successfully ! ",
    });
  }
);

//Seller[delete AUCTIONS]
router.delete(
  "/:auction_id",
  VerifyJWT,
  seller,

  async (req, res) => {
    //1-CHECK IF AUCTION IS EXISTS OR NOT
    const query = util.promisify(conn.query).bind(conn);
    const auction = await query(
      "select * from auctions where auction_id  = ?",
      [req.params.auction_id]
    );
    // kda al auction m4 mwgod asln
    if (!auction[0]) {
      res.status(400).json({
        msg: "Auction NOT Found !",
      });
    }

    //3-REMOVE IMAGE OF THE AUCTION
    fs.unlinkSync("./upload/" + auction[0].image_url);

    //4- Delete  auction in DB

    await query("DELETE FROM auctions  where auction_id = ?", [
      auction[0].auction_id,
    ]);

    res.status(200).json({
      msg: "auction Deleted successfully ! ",
    });
  }
);

//seller [Read his auctions]

router.get(
  "/:seller_id",
  VerifyJWT,
  seller,

  async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const auctionsOfSeller = await query(
      "select * from auctions where seller_id = ?",
      [req.params.seller_id]
    );
    auctionsOfSeller.map((auctionsOfSeller) => {
      auctionsOfSeller.image_url =
        "http://" + req.hostname + ":4000/" + auctionsOfSeller.image_url;
    });

    res.status(200).json(auctionsOfSeller);
  }
);

//create bid
//bidder bid on an auction
router.post(
  "/:auction_id/bid",
  VerifyJWT,
  bidder,
  body("bid_price").isNumeric().withMessage("Please enter a valid bid amount"),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);

      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if auction exists
      const auction = await query(
        "SELECT * FROM auctions WHERE auction_id = ?",
        [req.params.auction_id]
      );
      if (!auction[0]) {
        return res.status(404).json({ msg: "Auction not found!" });
      }

      // Check if auction has ended
      const curr = new Date();
      const end_Date = new Date(auction[0].end_date);
      if (curr > end_Date) {
        const status = "closed";
        await query(
          "UPDATE auctions SET auction_status = ? WHERE auction_id = ?",
          [status, req.params.auction_id]
        );
        return res.status(200).json({
          msg: "Auction time has ended. Bids can't be added.",
        });
      }

      // Check if bid amount is higher than current highest bid
      const highestBid = await query(
        "SELECT MAX(bid_price) as highest_bid FROM bid WHERE auction_id = ?",
        [req.params.auction_id]
      );
      if (highestBid[0].highest_bid >= req.body.bid_price) {
        return res.status(400).json({
          msg: "Bid amount must be higher than current highest bid!",
        });
      }

      // Retrieve details of current highest bidder and set them as loser
      const currentHighestBidder = await query(
        "SELECT bidder_id FROM bid WHERE auction_id = ? AND bid_price = ?",
        [req.params.auction_id, highestBid[0].highest_bid]
      );
      if (currentHighestBidder.length > 0) {
        await query(
          "UPDATE bid SET winner_status= 'loser' WHERE auction_id = ? AND bidder_id = ?",
          [req.params.auction_id, currentHighestBidder[0].bidder_id]
        );
      }

      // Prepare bid object
      // Prepare bid object with properly formatted datetime
      const bidObj = {
        bid_price: req.body.bid_price,
        bidder_id: req.user_id,
        // Convert the date to MySQL datetime format
        bid_datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
        auction_id: auction[0].auction_id,
        winner_status: "winner",
      };

      // Insert bid object into database
      await query("INSERT INTO bid SET ?", bidObj);

      // Check if auction end date has passed, if so, add a record to the transaction table
      const auctionStatus = await query(
        "SELECT auction_status FROM auctions WHERE auction_id = ?",
        [req.params.auction_id]
      );

      const seller = await query(
        "SELECT seller_id FROM auctions WHERE auction_id = ?",
        [req.params.auction_id]
      );
      const transactionObj = {
        auction_id: auction[0].auction_id,
        bidder_id: req.user_id,
        seller_id: seller[0].seller_id,
        transaction_date: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        winnig_bid: req.body.bid_price,
      };
      await query("INSERT INTO transaction SET ?", transactionObj);

      res.status(200).json({
        msg: "Bid added successfully!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// Show  auction history with winner

router.get("/:seller_id/winner", VerifyJWT, seller, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const auctionsOfSeller = await query(
    "SELECT bid.*, auctions.seller_id ,auctions.image_url FROM bid INNER JOIN auctions ON bid.auction_id = auctions.auction_id WHERE auctions.seller_id = ?",
    [req.params.seller_id]
  );
  auctionsOfSeller.map((auction) => {
    delete auction.seller_id;
    auction.image_url = "http://" + req.hostname + ":4000/" + auction.image_url;
  });
  res.status(200).json(auctionsOfSeller);
});

///show all auction&search
router.get("", VerifyJWT, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    search = `WHERE auction_name LIKE '%${req.query.search}%' OR category_name LIKE '%${req.query.search}%'`;
  }
  const auction = await query(`select * from auctions ${search}`);
  auction.map((auction) => {
    auction.image_url = "http://" + req.hostname + ":4000/" + auction.image_url;
  });
  res.status(200).json(auction);
});

//view won bidder and
router.get("/:bidder_id/winning-bids", VerifyJWT, bidder, async (req, res) => {
  const bidQuery = util.promisify(conn.query).bind(conn);

  const wonBids = await bidQuery(
    " SELECT a.*, b.bid_price,b.bid_datetime from auctions a INNER JOIN bid b ON a.auction_id = b.auction_id  where b.winner_status ='winner'and  b.bidder_id =?",
    [req.params.bidder_id]
  );

  wonBids.map((wonBids) => {
    wonBids.image_url = "http://" + req.hostname + ":4000/" + wonBids.image_url;
  });

  res.status(200).json(wonBids);
});
module.exports = router;
