module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE get_task_by_id(IN id INT, IN token TEXT)
    NO SQL
BEGIN
CALL authorization(token,@p_id,@p_email,@p_role,@p_department,@p_jobPosition);

SELECT
t.id as id,
t.task_name as task_name,
t.task_instructions as task_instructions,
t.deadline,
case
when MAX(d.id) is not null
then
CONCAT('[',GROUP_CONCAT(DISTINCT JSON_OBJECT('id',d.id,'name',d.name,'url',d.url,'uploaded_by',d.uploaded_by)),']')
else '[]'
end as files
FROM task t
left join document_task_rel dtr on dtr.task_id=t.id
left JOIN document d ON dtr.document_id=d.id
WHERE t.id=id
group by t.id;

END;`);
  }
};
