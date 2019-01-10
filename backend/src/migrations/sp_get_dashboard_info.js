module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize
      .query(`CREATE PROCEDURE get_dashboard_info(IN p_token TEXT)
        NO SQL
    BEGIN
    CALL authorization(p_token,@p_id,@p_email,@p_role,@p_department,@p_jobPosition);

    IF (@p_department='HR')
    THEN
SELECT MIN(A.deadline) as earliest_deadline,A.user as user_name, A.user_id as user_id, CONCAT('[',GROUP_CONCAT(JSON_OBJECT('label',A.state,'count',A.count)),']') as status
    FROM
       (select u.name as user, u.id as user_id, d.name as department, s.name as state,count(t.id) as count,MIN(t.deadline) as deadline from user u
    join state s
    left join task t on t.state_id=s.id and u.id=t.assignee_id
    left join department d on d.id=u.department_id
    group by u.id,s.name
       order by deadline) A
    GROUP BY A.user
    HAVING SUM(A.count) > 0
    ORDER BY MIN(A.deadline) ASC;
    ELSE
SELECT MIN(A.deadline) as earliest_deadline,A.user as user_name, A.user_id as user_id, CONCAT('[',GROUP_CONCAT(JSON_OBJECT('label',A.state,'count',A.count)),']') as status
    FROM
       (select u.name as user, u.id as user_id, d.name as department, s.name as state,count(t.id) as count,MIN(t.deadline) as deadline from user u
    join state s
    left join task t on t.state_id=s.id and u.id=t.assignee_id
    left join department d on d.id=u.department_id
    group by u.id,s.name
       order by deadline) A
       WHERE A.department = @p_department
    GROUP BY A.user
    HAVING SUM(A.count) > 0
    ORDER BY MIN(A.deadline) ASC;
    END IF;
    END;`);
  }
};
