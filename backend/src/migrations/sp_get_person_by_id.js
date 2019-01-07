module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE get_person_by_id(IN id INT, IN token TEXT)
    NO SQL
BEGIN
CALL authorization(token,@p_id,@p_email,@p_role,@p_department,@p_jobPosition);

SELECT u.id as id,
u.name as name,
u.email as email,
u.mobile as mobile,
r.id as role,
d.id as department,
j.id as jobPosition
FROM user u
left join role r on u.role_id=r.id
left join department d on u.department_id=d.id
left join job_position j on u.jobPosition_id=j.id WHERE u.deleted = false
and u.id=id;
END;`);
  }
};
