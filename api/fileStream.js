import gridfs from "gridfs-stream";
import mongoose from "mongoose";
import fs from "fs";
import fse from "fs-extra";
import { get, isArray } from "lodash";

let gfs = null;
const mongoUrl = "mongodb://localhost:27017/chat";
mongoose.connect(
  mongoUrl,
  {}
);
const connection = mongoose.connection;

connection.on("connected", () => {
  gfs = gridfs(connection.db, mongoose.mongo);
  console.log("gfs", gfs);
});
export const deleteTemporaryFile = filePath => {
  try {
    if (isArray(filePath)) {
      forEach(filePath, path => {
        path && fse.removeSync(path);
      });
    } else {
      filePath && fse.removeSync(filePath);
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const saveFilesInDB = (fileData, deleteFileAfterSave = true) => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      deleteTemporaryFile(get(fileData, "filePath", null));
      return reject({ error: "File is saving in the dataBase" });
    }
    try {
      let filePath = get(fileData, "filePath", null);
      let filename = get(fileData, "filename", null);

      if (!filename || !filePath) {
        return reject({ error: "incorrect file info to save in database." });
      }
      let otherOptions = get(fileData, "options", null);
      let options = {
        filename,
        mode: "w",
        chunkSize: 1024,
        metadata: {
          contentType: "image/*"
        },
        ...otherOptions
      };
      let writestream = gfs.createWriteStream(options);
      fs.createReadStream(filePath).pipe(writestream);

      writestream.on("close", file => {
        deleteFileAfterSave && deleteTemporaryFile(filePath);
        return resolve(file);
      });
      writestream.on("error", err => {
        deleteTemporaryFile(filePath);
        return reject(err);
      });
    } catch (err) {
      deleteTemporaryFile(filePath);
      return reject({ error: "Error in saving file in database." });
    }
  });
};
export const getFileStreamFromDB = fileId => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      return reject(new Error("Error in getting file data from database."));
    }
    try {
      let options = { _id: fileId };
      return resolve(gfs.createReadStream(options));
    } catch (err) {
      return reject(new Error("Error in try getting file data from database."));
    }
  });
};

export const getFileData = fileId => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      return reject(new Error("Error in getting file data from database."));
    }
    try {
      let options = { _id: fileId };
      return gfs.findOne(options, (err, file) => {
        if (err) {
          return reject(err);
        }
        return resolve(file);
      });
    } catch (err) {
      return reject(new Error("Error in try getting file data from database."));
    }
  });
};

export const deleteFileFromDB = (fileId = null, filename = null) => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      return reject(
        new InternalError("Error in deleting file data in database.")
      );
    }
    try {
      let options = fileId ? { _id: fileId } : { filename: filename };
      gfs.exist(options, (err, found) => {
        if (err)
          return reject(
            new InternalError("Error in deleting file data in database.")
          );

        gfs.remove(options, (err, gridStore) => {
          if (err) return reject(err);
          return resolve({ message: "file removed successfully." });
        });
      });
    } catch (err) {
      return reject(
        new InternalError("Error in deleting file data in database.")
      );
    }
  });
};
