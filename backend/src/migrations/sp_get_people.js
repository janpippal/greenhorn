module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE get_people()
    NO SQL
BEGIN
SELECT u.id as id,
u.name as name,
u.email as email,
u.mobile as mobile,
r.name as role,
d.name as department,
j.name as jobPosition
FROM user u
left join role r on u.role_id=r.id
left join department d on u.department_id=d.id
left join job_position j on u.jobPosition_id=j.id WHERE u.deleted = false;
END;`);
  }
};
