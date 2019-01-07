module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE update_person(IN token TEXT, IN p_person_id INT, IN p_mobile VARCHAR(255), IN p_name VARCHAR(255), IN p_role INT, IN p_department INT, IN p_jobPosition INT)
    NO SQL
BEGIN
CALL authorization(token,@p_id,@p_email,@p_role,@p_department,@p_jobPosition);
UPDATE user
set name=p_name,
mobile=p_mobile,
role_id=p_role,
department_id=p_department,
jobPosition_id=p_jobPosition
where id=p_person_id;
END;`);
  }
};
