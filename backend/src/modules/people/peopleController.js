import db from "../../models/";
import sgMail from "@sendgrid/mail";
import cryptoRandomString from "crypto-random-string";

export const getPeopleController = async (req, res, next) => {
  const people = await db.sequelize
    .query("CALL get_people()", { type: db.sequelize.QueryTypes.RAW })
    .then(people => {
      res.json({
        people
      });
      return;
    })
    .catch(error => {
      res.status(500),
        res.json({
          message: "error obtaining list of users"
        });
      return;
    });
  return;
};

export const addPersonController = async (req, res, next) => {
  const { body } = req;
  const linkString = cryptoRandomString(15);
  await db.sequelize
    .query(
      "CALL add_person(:email, :name, :mobile, :role_id, :department_id, :jobPosition_id, :emailToken)",
      {
        type: db.sequelize.QueryTypes.RAW,
        replacements: {
          name: body.firstName + " " + body.lastName,
          email: body.email,
          mobile: body.mobile,
          role_id: body.role_id,
          department_id: body.department_id,
          jobPosition_id: body.jobPosition_id,
          emailToken: linkString
        }
      }
    )
    .then((results, metadata) => {
      sendEmail(body.email, body.firstName + " " + body.lastName, linkString);
      if (body.assignTasks) {
        db.sequelize.query("CALL create_tasks(:email)", {
          type: db.sequelize.QueryTypes.RAW,
          replacements: {
            email: body.email
          }
        });
      }
      res.status(200);
      res.json({
        message: "SUCCESS"
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

const sendEmail = async (email, name, linkString) => {
  let firstPartOfKey = 'SG.';
  let secondPartOfKey = 'YgIpDSSvTjS57s';
  let thirdPartOfKey = 'YfcmJvoQ';
  let fourthPartOfKey = '.rh9rjCp9Ewd';
  let fifthPartOfKey= '08AeuJjFfmQVBU85x2';
  let sixthPartOfKey= 'tiD80XMZs4wJZI';
  const html =
    `Hello <strong>` +
    name +
    `</strong>,
    <br/>
    <br/>
    I am sending you this link <a href="http://dev.frontend.xpipj04.vse.handson.pro/setpassword/` +
    linkString +
    `">Set password<a>
    <br/>
    <br/>
    Best regards,
    <br/>
    <br/>
    Greenhorn Team`;
  sgMail.setApiKey(
    firstPartOfKey + secondPartOfKey + thirdPartOfKey + fourthPartOfKey + fifthPartOfKey + sixthPartOfKey
  );
  const msg = {
    to: email,
    from: "team08@greenhorn.com",
    subject: "Set password",
    html: html
  };
  sgMail.send(msg).catch(error => {
    return;
  });
};

export const deletePersonController = async (req, res, next) => {
  const { params } = req;
  await db.sequelize
    .query("CALL set_to_deleted(:id);", {
      type: db.sequelize.QueryTypes.RAW,
      replacements: { id: params.id }
    })
    .then(() => {
      res.status(200);
      res.json({
        message: "Person deleted"
      });
      return;
    })
    .catch(error => {
      res.status(500);
      res.json({
        message: "Error when deleting user"
      });
      return;
    });
};

export const personGetByIdController = async (req, res, next) => {
  const { authorization } = req.headers;
  const { params } = req;
  const tasks = await db.sequelize
    .query(`CALL get_person_by_id(:person_id,:token)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: { token: authorization, person_id: params.person_id }
    })
    .spread((person, metadata) => {
      res.json({
        person
      });
      return;
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      res.json({
        message: "Error fetching person"
      });
      return;
    });
};

export const updatePersonByIdController = async (req, res, next) => {
  const { authorization } = req.headers;
  const { body } = req;
  const tasks = await db.sequelize
    .query(
      `CALL update_person(:token,:person_id,:mobile,:name,:role,:department,:jobPosition)`,
      {
        type: db.sequelize.QueryTypes.RAW,
        replacements: {
          token: authorization,
          person_id: body.person_id,
          mobile: body.mobile,
          name: body.name,
          role: body.role,
          department: body.department,
          jobPosition: body.jobPosition
        }
      }
    )
    .then(() => {
      res.status(200);
      res.json({
        message: "OK"
      });
      return;
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      res.json({
        message: "Error updating person"
      });
      return;
    });
};
