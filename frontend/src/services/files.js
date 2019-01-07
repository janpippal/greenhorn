export const uploadFile = (files, type, uploaded_by) => async (
  dispatch,
  getState,
  { api }
) => {
  if (type === "tasks") {
    let data = new FormData();
    let alreadyExistingIds = [];
    let numberOfNewFiles = 0;
    for (var i = 0; i < files.length; i++) {
      if (!files[i].id) {
        data.append("file", files[i]);
        numberOfNewFiles++;
      } else {
        alreadyExistingIds.push(files[i].id);
      }
    }
    let result = [];
    if (numberOfNewFiles > 0) {
      const fileUploadResult = await api.post("tasks/upload/"+uploaded_by, data);
      result = fileUploadResult.data.createdID;
    }
    if (alreadyExistingIds) {
      alreadyExistingIds.forEach(alreadyExistingId => {
        result.push(alreadyExistingId);
      });
    }
    return result;
  } else if (type === "templates") {
    let data = new FormData();
    for (var j = 0; j < files.length; j++) {
      data.append("file", files[j]);
    }
    const fileUploadResult = await api.post("templates/upload", data);
    return fileUploadResult.data.createdID;
  }
};
