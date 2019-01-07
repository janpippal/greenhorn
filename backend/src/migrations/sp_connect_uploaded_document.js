module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE PROCEDURE connect_uploaded_document(IN p_task_id INT, IN p_document_id INT, IN p_unique_stamp VARCHAR(255), IN p_delete_previous BOOLEAN)
    NO SQL
BEGIN
IF (p_delete_previous)
THEN
DELETE FROM document_task_rel where task_id=p_task_id and unique_stamp <> p_unique_stamp;
ELSE
INSERT INTO document_task_rel (task_id,document_id,unique_stamp) VALUES (p_task_id,p_document_id,p_unique_stamp);
END IF;
END;`);
  }
};
