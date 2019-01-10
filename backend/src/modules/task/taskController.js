import db from "../../models/";
import fs from "fs-extra";

export const taskDashController = async (req, res, next) => {
  const { authorization } = req.headers;
  await db.sequelize
    .query(`CALL 	get_dashboard_info(:token)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: { token: authorization }
    })
    .then(dashboard => {
      if (dashboard.length === 0) {
        res.json({
          dashboard: []
        });
        return;
      } else {
        dashboard.forEach(function(element) {
          let statusToBeArray = JSON.parse(element.status);
          delete element["status"];
          element["status"] = statusToBeArray;
        });
        res.json({
          dashboard
        });
        return;
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500);
      res.json({
        message: "Error fetching dashboard"
      });
      return;
    });
};

export const taskAddController = async (req, res, next) => {
  const { body } = req;
  for (var i = 0; i < body.length; i++) {
    let currentTask = body[i];
    const people = await db.sequelize
      .query(
        "CALL add_task( :deadline, :assignee, :owner_id, :task_name, :task_instructions, @p_created_id); select @p_created_id as created_id;",
        {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: {
            deadline: currentTask.deadline,
            assignee: currentTask.employee_id,
            task_name: currentTask.task_name,
            task_instructions: currentTask.task_instructions,
            owner_id: currentTask.owner_id
          }
        }
      )
      .spread((results,metadata) => {
        let created_id = metadata[0].created_id;
        console.log(currentTask.files.length);
        let timestamp = Math.round(new Date().getTime() / 1000);
        if (currentTask.files.length && currentTask.files.length > 0) {
          for (var j = 0; j < currentTask.files.length; j++) {
            db.sequelize.query(
              "CALL assign_document(:task_id,:document_id,:unique_stamp);",
              {
                replacements: {
                  task_id: created_id,
                  document_id: currentTask.files[j],
                  unique_stamp: timestamp
                }
              }
            );
          }
        }
      });
  }
  return res.json({
    message: "OK"
  });
};

export const taskGetController = async (req, res, next) => {
  const { authorization } = req.headers;
  const tasks = await db.sequelize
    .query(`CALL get_tasks(:token)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: { token: authorization }
    })
    .then(tasks => {
      if (tasks.length === 0) {
        res.json({
          tasks: []
        });
        return;
      } else {
        tasks.forEach(function(element) {
          let filesToBeArray = JSON.parse(element.files);
          let historyToBeArray = JSON.parse(element.history);
          delete element["files"];
          delete element["history"];
          element["files"] = filesToBeArray;
          element["history"] = historyToBeArray;
        });
        res.json({
          tasks
        });
        return;
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500);
      res.json({
        message: "Error fetching tasks"
      });
      return;
    });
};

export const taskFileUploadController = async (req, res, next) => {
  const { params } = req;
  if (req.files.file.length) {
    let files = req.files.file;
    var timeStamp = Math.floor(Date.now());
    if (!fs.existsSync(`public/` + timeStamp)) {
      fs.mkdirSync(`public/` + timeStamp);
    }
    const IDs = [];
    for (var j = 0; j < files.length; j++) {
      let currentFile = files[j];
      currentFile.mv(`public/` + timeStamp + `/${currentFile.name}`);
      await db.sequelize
        .query(
          " INSERT INTO document (name, file_type, url, uploaded_by) " +
            " VALUES ( :name, :file_type,:url,:uploaded_by);",
          {
            replacements: {
              name: currentFile.name,
              file_type: currentFile.mimetype,
              url: "/" + timeStamp + "/" + currentFile.name,
              uploaded_by: params.uploaded_by
            }
          }
        )
        .spread(results => {
          IDs.push(results);
        });
    }
    return res.json({
      createdID: IDs
    });
  } else {
    let file = req.files.file;
    const id = [];
    var timeStamp = Math.floor(Date.now());
    if (!fs.existsSync(`public/` + timeStamp)) {
      fs.mkdirSync(`public/` + timeStamp);
    }
    file.mv(`public/` + timeStamp + `/${file.name}`);
    await db.sequelize
      .query(
        " INSERT INTO document (name, file_type, url,uploaded_by) " +
          " VALUES ( :name, :file_type,:url,:uploaded_by);",
        {
          replacements: {
            name: file.name,
            file_type: file.mimetype,
            url: "/" + timeStamp + "/" + file.name,
            uploaded_by: params.uploaded_by
          }
        }
      )
      .spread(results => {
        id.push(results);
      });

    return res.json({
      createdID: id
    });
  }
};

export const updateTaskController = async (req, res, next) => {
  const { params, body } = req;
  await db.sequelize.query(
    " UPDATE task SET state_id=(SELECT id FROM state where name=:new_status) where id=:task_id;",
    { replacements: { new_status: body.newState, task_id: params.id } }
  );
  let actionString = "moved to " + body.newState;
  await db.sequelize.query(
    " CALL create_history_record(:task_id,:action,:user_id,:created_at)",
    {
      replacements: {
        action: actionString,
        task_id: params.id,
        user_id: body.user_id,
        created_at: new Date()
      }
    }
  );
  return res.json({
    message: "OK"
  });
};

export const taskGetByIdController = async (req, res, next) => {
  const { authorization } = req.headers;
  const { params } = req;
  const tasks = await db.sequelize
    .query(`CALL get_task_by_id(:task_id,:token)`, {
      type: db.sequelize.QueryTypes.RAW,
      replacements: { token: authorization, task_id: params.task_id }
    })
    .spread((task, metadata) => {
      let filesToBeArray = JSON.parse(task.files);
      delete task["files"];
      task["files"] = filesToBeArray;
      res.json({
        task
      });
      return;
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      res.json({
        message: "Error fetching task"
      });
      return;
    });
};

export const updateTaskByIdController = async (req, res, next) => {
  const { authorization } = req.headers;
  const { body } = req;
  const tasks = await db.sequelize
    .query(
      `CALL update_task(:token,:task_id,:deadline,:task_name,:task_instructions)`,
      {
        type: db.sequelize.QueryTypes.RAW,
        replacements: {
          token: authorization,
          task_id: body.task_id,
          deadline: body.deadline,
          task_name: body.task_name,
          task_instructions: body.task_instructions
        }
      }
    )
    .then(() => {
      let timestamp = Math.round(new Date().getTime() / 1000);
      if (body.files.length && body.files.length > 0) {
        for (var j = 0; j < body.files.length; j++) {
          db.sequelize.query(
            "CALL connect_uploaded_document(:task_id,:document_id,:timestamp,true);",
            {
              replacements: {
                task_id: body.task_id,
                document_id: body.files[j],
                timestamp: timestamp
              }
            }
          );
        }
      }
      let actionString = "task information updated";
      db.sequelize.query(
        " CALL create_history_record(:task_id,:action,:user_id,:created_at)",
        {
          replacements: {
            action: actionString,
            task_id: body.task_id,
            user_id: body.owner_id,
            created_at: new Date()
          }
        }
      );
      res.status(200);
      res.json({
        message: "OK"
      });
      return;
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      res.json({
        message: "Error fetching task"
      });
      return;
    });
};
export const updateTaskFilesByIdController = async (req, res, next) => {
  const { body } = req;
  if (body.files.length && body.files.length > 0) {
    let timestamp = Math.round(new Date().getTime() / 1000);
    for (var j = 0; j < body.files.length; j++) {
      db.sequelize
        .query(
          "CALL connect_uploaded_document(:task_id,:document_id,:timestamp,false);",
          {
            replacements: {
              task_id: body.task_id,
              document_id: body.files[j],
              timestamp: timestamp
            }
          }
        )
        .catch(error => {
          console.log(error);
        });
    }
  }
  res.status(200);
  res.json({
    message: "OK"
  });
  return;
};
