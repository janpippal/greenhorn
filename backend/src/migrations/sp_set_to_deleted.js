module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(`CREATE PROCEDURE set_to_deleted(IN p_id INT)
    NO SQL
BEGIN
UPDATE user SET deleted=true where id=p_id;
END;`);
  }
};
