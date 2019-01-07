module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`
CREATE PROCEDURE auth(IN p_email VARCHAR(255), IN p_password VARCHAR(255))
    NO SQL
BEGIN

IF NOT EXISTS (
SELECT 1
FROM user
WHERE email=p_email
AND password=p_password
AND deleted=0
)
THEN SIGNAL SQLSTATE '45001' SET MESSAGE_TEXT = 'Login failed';
ELSE
SELECT
u.id,
u.name,
u.email,
r.name AS role,
d.name AS department,
jp.name AS job_position
FROM user u
left JOIN job_position jp on u.jobPosition_id=jp.id
left JOIN department d on u.department_id=d.id
left JOIN role r on u.role_id=r.id
WHERE email=p_email
AND password=p_password
AND u.deleted=0
LIMIT 1;
END IF;
END;`);
  }
};
