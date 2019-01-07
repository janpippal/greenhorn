module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE create_token_for_user(IN p_user_id INT, IN p_token TEXT, IN p_expires_at VARCHAR(50), IN p_active BOOLEAN)
    NO SQL
BEGIN
INSERT INTO token (user_id, token, expiresAt, active ) VALUES (p_user_id,p_token,p_expires_at,p_active);
END;`);
  }
};
