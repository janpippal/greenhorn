module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE deactivate_tokens_for_user(IN p_user_id INT)
    NO SQL
BEGIN
UPDATE token SET active=0 WHERE user_id=p_user_id;
END;`);
  }
};
