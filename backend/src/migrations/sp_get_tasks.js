module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE get_tasks(IN token TEXT)
BEGIN
CALL authorization(token,@p_id,@p_email,@p_role,@p_department,@p_jobPosition);

IF @p_role='admin' AND @p_department='HR'
THEN
SELECT
t.id as id,
t.task_name as task_name,
t.task_instructions as task_instructions,
t.deadline,
DATEDIFF(t.deadline,NOW()) as days_to_deadline,
s.name as state,
case
when MAX(d.id) is not null
then
CONCAT('[',GROUP_CONCAT(DISTINCT JSON_OBJECT('id',d.id,'name',d.name,'url',d.url,'uploaded_by',d.uploaded_by)),']')
else '[]'
end as files,
case
when MAX(th.id) is not null
then
CONCAT('[',GROUP_CONCAT(DISTINCT JSON_OBJECT('id',th.id,'action',th.action,'by',th.changed_by,'at',th.createdAt)),']')
else '[]'
end as history,
ua.name as assignee,
uo.name as owner
FROM task t
left join document_task_rel dtr on dtr.task_id=t.id
left JOIN document d ON dtr.document_id=d.id
inner join state s on t.state_id=s.id
inner join user ua on ua.id=t.assignee_id
inner join user uo on uo.id=t.owner_id
left join task_history th on th.task_id=t.id
group by t.id
order by t.deadline ASC;

ELSEIF @p_role='admin' AND @p_department <> 'HR'
THEN
SELECT
t.id as id,
t.task_name as task_name,
t.task_instructions as task_instructions,
t.deadline,
DATEDIFF(t.deadline,NOW()) as days_to_deadline,
s.name as state,
case
when MAX(d.id) is not null
then
CONCAT('[',GROUP_CONCAT(DISTINCT JSON_OBJECT('id',d.id,'name',d.name,'url',d.url,'uploaded_by',d.uploaded_by)),']')
else '[]'
end as files,
case
when MAX(th.id) is not null
then
CONCAT('[',GROUP_CONCAT(DISTINCT JSON_OBJECT('id',th.id,'action',th.action,'by',th.changed_by,'at',th.createdAt)),']')
else '[]'
end as history,
ua.name as assignee,
uo.name as owner
FROM task t
left join document_task_rel dtr on dtr.task_id=t.id
left JOIN document d ON dtr.document_id=d.id
inner join state s on t.state_id=s.id
inner join user ua on ua.id=t.assignee_id
inner join user uo on uo.id=t.owner_id
inner join department uod on uod.id=uo.department_id
left join task_history th on th.task_id=t.id
WHERE uod.name=@p_department
group by t.id
order by t.deadline ASC;
ELSEIF @p_role='employee'
THEN
SELECT
t.id as id,
t.task_name as task_name,
t.task_instructions as task_instructions,
t.deadline,
DATEDIFF(t.deadline,NOW()) as days_to_deadline,
s.name as state,
case
when MAX(d.id) is not null
then
CONCAT('[',GROUP_CONCAT( DISTINCT JSON_OBJECT('id',d.id,'name',d.name,'url',d.url,'uploaded_by',d.uploaded_by)),']')
else '[]'
end as files,
case
when MAX(th.id) is not null
then
CONCAT('[',GROUP_CONCAT(DISTINCT JSON_OBJECT('id',th.id,'action',th.action,'by',th.changed_by,'at',th.createdAt)),']')
else '[]'
end as history,
ua.name as assignee,
uo.name as owner
FROM task t
left join document_task_rel dtr on dtr.task_id=t.id
left JOIN document d ON dtr.document_id=d.id
inner join state s on t.state_id=s.id
inner join user ua on ua.id=t.assignee_id
inner join user uo on uo.id=t.owner_id
left join task_history th on th.task_id=t.id
WHERE assignee_id=@p_id
group by t.id
order by t.deadline ASC;
END IF;
END;`);
  }
};
