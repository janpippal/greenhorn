module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE assign_document(IN p_task_id INT, IN p_document_id INT, IN p_unique_stamp VARCHAR(255))
    NO SQL
BEGIN
INSERT INTO document_task_rel (task_id,document_id,unique_stamp) VALUES ( p_task_id,p_document_id,p_unique_stamp );
END;`);
  }
};
