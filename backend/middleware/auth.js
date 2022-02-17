const jwt = require("jsonwebtoken");
const db = require("../models/db.user");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.cookies;

    if (token) {
      jwt.verify(token, "TOKEN_DE_TEST", async (err, decodedToken) => {
        if (err) {
          // res.locals.user = null;
          // res.cookies("jwt", "", { maxAge: 1 });
          console.log("pas de token");
        } else {
          let user = await db.getUserId(decodedToken.id);
          // res.local.user = user;

          next();
        }
      });
    } else {
      res.locals.user = null;
      res.status(400).json({ message: "Requete non authentifié" });
    }
  } catch (err) {
    res.status(401).json({ error: ("" + err) | "Requete non authentifié" });
  }
};
