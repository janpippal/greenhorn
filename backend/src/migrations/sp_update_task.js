module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE update_task(IN token TEXT, IN p_id INT, IN deadline VARCHAR(255), IN task_name VARCHAR(255), IN task_instructions VARCHAR(255))
    NO SQL
BEGIN
CALL authorization(token,@p_id,@p_email,@p_role,@p_department,@p_jobPosition);

UPDATE task SET
deadline=deadline,
task_name=task_name,
task_instructions=task_instructions
WHERE id=p_id;

END;`);
  }
};
