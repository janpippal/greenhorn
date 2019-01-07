module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE get_assigned_templates()
    NO SQL
BEGIN
SELECT
jp.name,
jp.id as job_position_id,
case
  when MAX(tt.id) is not null
then CONCAT('[',GROUP_CONCAT(JSON_OBJECT('template_id',tt.id,'template_name',tt.template_name)),']')
else '[]'
end as templates
FROM job_position_template_rel jptr
RIGHT JOIN job_position jp on jp.id=jptr.job_position_id
LEFT JOIN task_template tt on tt.id=jptr.template_id
group by jp.name,jp.id;

END;`);
  }
};
