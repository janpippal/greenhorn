module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE unassign_template(IN p_job_position_id INT, IN p_template_id INT)
    NO SQL
BEGIN
DELETE FROM job_position_template_rel WHERE job_position_id=p_job_position_id AND template_id=p_template_id;
END;`);
  }
};
