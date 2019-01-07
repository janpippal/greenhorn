import db from "../../models/";
import fs from "fs-extra";

export const addTemplateController = async (req, res, next) => {
  const { body } = req;

  let currentTemplate = body;
  const people = await db.sequelize
    .query(
      " INSERT INTO task_template (template_name,task_name,task_instructions,future_days) " +
        " VALUES ( :template_name,:task_name,:task_instructions,:future_days );",
      {
        replacements: {
          template_name: currentTemplate.templateTitle,
          task_name: currentTemplate.taskTitle,
          task_instructions: currentTemplate.taskInstructions,
          future_days: currentTemplate.futureDay
        }
      }
    )
    .spread(results => {
      if (currentTemplate.files.length) {
        for (var j = 0; j < currentTemplate.files.length; j++) {
          db.sequelize.query(
            " INSERT INTO document_template_rel (template_id,document_id) VALUES ( :template_id,:document_id );",
            {
              replacements: {
                template_id: results,
                document_id: currentTemplate.files[j]
              }
            }
          );
        }
      } else {
        db.sequelize.query(
          " INSERT INTO document_template_rel (template_id,document_id) VALUES ( :template_id,:document_id );",
          {
            replacements: {
              template_id: results,
              document_id: currentTemplate.files
            }
          }
        );
      }
    })
    .catch(error => {
      console.log(error);
    });

  return res.json({
    message: "OK"
  });
};

export const templateFileUploadController = async (req, res, next) => {
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
          " INSERT INTO document (name, file_type, url,uploaded_by) " +
            " VALUES ( :name, :file_type,:url,'owner');",
          {
            replacements: {
              name: currentFile.name,
              file_type: currentFile.mimetype,
              url: "/" + timeStamp + "/" + currentFile.name
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
    let id = "";
    var timeStamp = Math.floor(Date.now());
    if (!fs.existsSync(`public/` + timeStamp)) {
      fs.mkdirSync(`public/` + timeStamp);
    }
    file.mv(`public/` + timeStamp + `/${file.name}`);
    await db.sequelize
      .query(
        " INSERT INTO document (name, file_type, url,uploaded_by) " +
          " VALUES ( :name, :file_type,:url,'owner');",
        {
          replacements: {
            name: file.name,
            file_type: file.mimetype,
            url: "/" + timeStamp + "/" + file.name
          }
        }
      )
      .spread(results => {
        id = results;
      });

    return res.json({
      createdID: id
    });
  }
};

export const templateGetController = async (req, res, next) => {
  await db.sequelize
    .query(`CALL get_templates()`, {
      type: db.sequelize.QueryTypes.RAW
    })
    .then(templates => {
      templates.forEach(function(element) {
        let filesToBeArray = JSON.parse(element.files);
        delete element["files"];
        element["files"] = filesToBeArray;
      });
      return res.json({
        templates
      });
    });
};

export const getAssignedTemplatesController = async (req, res, next) => {
  const assignedTemplates = await db.sequelize
    .query(`CALL get_assigned_templates()`, {
      type: db.sequelize.QueryTypes.RAWW
    })
    .then(assignedTemplates => {
      assignedTemplates.forEach(function(element) {
        let templatesToBeArray = JSON.parse(element.templates);
        delete element["templates"];
        element["templates"] = templatesToBeArray;
      });
      return res.json({
        assignedTemplates
      });
    });
};

export const unassignTemplateController = async (req, res, next) => {
  const { query } = req;
  let job_position_id = query.job_position_id;
  let template_id = query.template_id;

  await db.sequelize
    .query(`CALL unassign_template(:job_position_id,:template_id)`, {
      type: db.sequelize.QueryTypes.DELETE,
      replacements: {
        template_id: template_id,
        job_position_id: job_position_id
      }
    })
    .then(() => {
      res.json({
        message: "OK"
      });
      return;
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      res.json({
        message: "Failed unassigning template"
      });
      return;
    });
};

export const assignTemplateController = async (req, res, next) => {
  const { body } = req;
  let job_position_id = body.job_position_id;
  let template_ids = body.templatesIds;
  for (var i = 0; i < template_ids.length; i++) {
    let template_id = template_ids[i];
    const assignedTemplates = await db.sequelize
      .query(`CALL assign_template(:job_position_id,:template_id)`, {
        type: db.sequelize.QueryTypes.INSERT,
        replacements: {
          template_id: template_id,
          job_position_id: job_position_id
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500);
        res.json({
          message: error.message
        });
        return;
      });
  }
  res.json({
    message: "OK"
  });
  return;
};
