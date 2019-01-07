import db from "../../models/";
import jwt from "jsonwebtoken";

export const authController = async (req, res, next) => {
  const { body } = req;
  await db.sequelize
    .query(`CALL auth(:email,:password)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: {
        email: body.email,
        password: body.password
      }
    })
    .then(user => {
      let token = getToken(user);
      deactivateExistingTokenForUser(user);
      saveTokenForUser(user, token).then(result => {
        if (result.message === "FAILED") {
          return (
            res.status(500),
            res.json({
              message: "Error creating user token"
            })
          );
        } else if (result.message === "SUCCESS") {
          return res.json({
            user: user[0],
            token
          });
        }
      });
    })
    .catch(error => {
      res.status(404);
      res.json({ message: error.message });
      return;
    });
};

const getToken = user => {
  return jwt.sign(JSON.parse(JSON.stringify(user))[0], "shhhhh", {
    expiresIn: 60 * 60 * 24
  });
};

const deactivateExistingTokenForUser = async user => {
  await db.sequelize.query(`CALL deactivate_tokens_for_user(:user_id)`, {
    type: db.sequelize.QueryTypes.RAW,
    replacements: { user_id: user[0].id }
  });
};

const saveTokenForUser = async (user, token) => {
  let expirationDate = new Date(0);
  expirationDate.setUTCSeconds(jwt.decode(token).exp);
  let result = "";

  await db.sequelize
    .query(`CALL create_token_for_user(:user_id,:token,:expiresAt,:active)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: {
        active: true,
        user_id: user[0].id,
        expiresAt: expirationDate,
        token: token
      }
    })
    .then(() => {
      result = { message: "SUCCESS" };
    })
    .catch(error => {
      result = { message: "FAILED" };
    });
  return result;
};

export const setPasswordController = async (req, res, next) => {
  const { body } = req;
  await db.sequelize
    .query(`CALL set_password_for_user(:token,:password)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: {
        token: body.token,
        password: body.password
      }
    })
    .then(() => {
      res.json({
        message: "OK"
      });
      return;
    })
    .catch(error => {
      res.status(500);
      res.json({
        message: error.message
      });
      return;
    });
};
