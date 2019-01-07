import db from "../../models/";

export const catalogController = async (req, res, next) => {
  const departments = await db.sequelize
    .query("SELECT id, name FROM department", {
      type: db.sequelize.QueryTypes.RAW
    })
    .spread(departments => {
      return departments;
    })
    .catch(() => {
      res.status(500);
      res.json({ message: "Error fetching catalogs" });
      return;
    });
  const roles = await db.sequelize
    .query("SELECT id, name FROM role", { type: db.sequelize.QueryTypes.RAW })
    .spread(roles => {
      return roles;
    })
    .catch(() => {
      res.status(500);
      res.json({ message: "Error fetching catalogs" });
      return;
    });
  const jobPositions = await db.sequelize
    .query("SELECT id, name FROM job_position", {
      type: db.sequelize.QueryTypes.RAW
    })
    .spread(jobPositions => {
      return jobPositions;
    })
    .catch(() => {
      res.status(500);
      res.json({ message: "Error fetching catalogs" });
      return;
    });

  res.json({
    departments,
    roles,
    jobPositions
  });
  return;
};
