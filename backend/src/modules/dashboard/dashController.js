import db from "../../models/";

export const dashController = async (req, res, next) => {
  const { authorization } = req.headers;
  await db.sequelize
    .query(`CALL 	get_dashboard_info(:token)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: { token: authorization }
    })
    .then(dashboard => {
      if (dashboard.length === 0) {
        res.json({
          dashboard: []
        });
        return;
      } else {
        dashboard.forEach(function(element) {
          let statusToBeArray = JSON.parse(element.status);
          delete element["status"];
          element["status"] = statusToBeArray;
        });
        res.json({
          dashboard
        });
        return;
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500);
      res.json({
        message: "Error fetching dashboard"
      });
      return;
    });
};
