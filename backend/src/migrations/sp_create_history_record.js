module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE create_history_record(IN p_task_id INT, IN p_action VARCHAR(255), IN p_user_id INT, IN p_created_at DATETIME)
    NO SQL
BEGIN

INSERT INTO task_history (task_id,action,changed_by,createdAt)
VALUES (p_task_id,
        p_action,
        (SELECT name FROM user WHERE id=p_user_id),
        p_created_at);

END;`);
  }
};
