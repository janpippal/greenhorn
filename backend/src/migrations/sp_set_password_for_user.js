module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE set_password_for_user(IN p_token TEXT, IN p_password VARCHAR(50))
    NO SQL
BEGIN
IF NOT EXISTS (
SELECT 1
FROM reset_password
WHERE token=p_token and active=true
)
THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not active token';
ELSE
UPDATE user
SET password=p_password
WHERE id=(
SELECT user_id
FROM reset_password
WHERE token=p_token and active=true);
UPDATE reset_password
SET active=false
WHERE token=p_token and active=true;

END IF;
END;`);
  }
};
