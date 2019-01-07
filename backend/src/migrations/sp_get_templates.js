module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE get_templates()
    NO SQL
BEGIN
SELECT
t.id as id,
template_name,
task_name,
task_instructions,
future_days,
case
  when MAX(d.id) is not null
  then  CONCAT('[',GROUP_CONCAT(JSON_OBJECT('id',d.id,'name',d.name,'url', d.url)),']')
  else '[]'
end as files
FROM task_template t
left join document_template_rel dtr on dtr.template_id=t.id
left JOIN document d ON dtr.document_id=d.id
group by t.id;
END;`);
  }
};
