module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE create_tasks(IN p_email VARCHAR(255))
    NO SQL
BEGIN
DECLARE p_user_id INT;
DECLARE p_job_position_id INT;
SELECT id,jobPosition_id INTO p_user_id,p_job_position_id FROM user where email=p_email;


INSERT INTO task (task_name,task_instructions,task_template_id,deadline,state_id,assignee_id,owner_id)
SELECT tt.task_name,
tt.task_instructions,
tt.id,
ADDDATE(NOW(),tt.future_days),
1,
p_user_id,
1
FROM job_position_template_rel jptr
join task_template tt on tt.id=jptr.template_id
where jptr.job_position_id=p_job_position_id;

INSERT INTO document_task_rel (task_id,document_id,unique_stamp)
select t.id,dtr.document_id,null
from task t
join job_position_template_rel jptr on jptr.job_position_id=p_job_position_id and t.task_template_id=jptr.template_id
join document_template_rel dtr on dtr.template_id=t.task_template_id
where t.task_template_id is not null;

update task set task_template_id=null where 1=1;

END;`);
  }
};
