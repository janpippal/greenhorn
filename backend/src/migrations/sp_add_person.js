module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE PROCEDURE add_person(IN p_email VARCHAR(255), IN p_name VARCHAR(255), IN p_mobile VARCHAR(255), IN p_role_id VARCHAR(255), IN p_department_id VARCHAR(255), IN p_jobPosition_id VARCHAR(255), IN p_emailToken VARCHAR(255))
          NO SQL
      BEGIN
      DECLARE numberOfUsers INTEGER;
      SELECT count(*) into numberOfUsers FROM user where email=p_email AND deleted=0;
      IF (numberOfUsers > 0 )
      THEN SIGNAL SQLSTATE '45001' SET MESSAGE_TEXT = 'Email address is already used';
      END IF;
      INSERT INTO user (name, email, mobile, role_id, department_id, jobPosition_id) VALUES (p_name, p_email, p_mobile, p_role_id, p_department_id, p_jobPosition_id);
      INSERT INTO reset_password (token,active,user_id) VALUES (p_emailToken,true,(SELECT id FROM user WHERE email=p_email AND name=p_name));
      END;`);
  }
};
