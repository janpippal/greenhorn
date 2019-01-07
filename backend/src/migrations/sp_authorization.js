module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE PROCEDURE authorization(IN token TEXT, OUT p_id INT, OUT p_email VARCHAR(100), OUT p_role VARCHAR(50), OUT p_department VARCHAR(50), OUT p_jobPosition VARCHAR(50))
          NO SQL
      BEGIN

      DROP TEMPORARY TABLE IF EXISTS temp_user;
      CREATE TEMPORARY TABLE temp_user(
      id int NOT NULL,
      email varchar(100) NOT NULL,
      role varchar(20) NOT NULL,
      department varchar(20),
      jobPosition varchar(20)
      );

      IF NOT EXISTS (
      SELECT 1
      FROM token t
      JOIN user u on u.id=t.user_id
      WHERE t.token=token AND u.deleted=0
      )
      THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'authentication failed.';
      ELSE

      SELECT u.id,
      u.email,
      r.name as role,
      d.name as department,
      jp.name as jobPosition
      INTO
      p_id,
      p_email,
      p_role,
      p_department,
      p_jobPosition
      FROM token t
      INNER JOIN user u on u.id=t.user_id
      LEFT JOIN role r on r.id=u.role_id
      LEFT JOIN job_position jp on jp.id=u.jobPosition_id
      LEFT JOIN department d on d.id=u.department_id
      WHERE t.token=token AND u.deleted=0;

      END IF;
      END;`);
  }
};
