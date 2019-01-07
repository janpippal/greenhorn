module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE PROCEDURE assign_template(IN p_job_position_id INT, IN p_template_id INT)
    NO SQL
BEGIN
IF EXISTS(SELECT 1 FROM job_position_template_rel jptr where jptr.job_position_id=p_job_position_id and jptr.template_id=p_template_id)
THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Assigment already exists.';
ELSE
INSERT INTO job_position_template_rel (job_position_id,template_id) VALUES (p_job_position_id,p_template_id);
END IF;
END;`);
  }
};
