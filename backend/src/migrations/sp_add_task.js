module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE add_task(IN p_deadline DATE, IN p_assignee VARCHAR(255), IN p_owner_id INT, IN p_task_name TEXT, IN p_task_instructions TEXT)
    NO SQL
BEGIN
INSERT INTO task (deadline,state_id,assignee_id,owner_id,task_name,task_instructions)
VALUES ( p_deadline, 1, p_assignee, p_owner_id, p_task_name, p_task_instructions );
END;`);
  }
};
