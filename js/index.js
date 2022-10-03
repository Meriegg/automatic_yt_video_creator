const fs = require("fs");
const path = require("path");
const { exec } = require("child_process_async");

const MAIN_VIDEO_PATH = path.resolve(__dirname, "../videos");
const LIST_FILE_PATH = path.resolve(__dirname, "../videos/list.txt");

const executeFileMergeAndUpload = async (
  OUTPUT_FILE_NAME,
  FINAL_OUTPUT_FILE_PATH
) => {
  const fileMergeScript = await exec(
    `ffmpeg -safe 0 -f concat -i ${LIST_FILE_PATH} -c copy ${OUTPUT_FILE_NAME}`
  );

  if (fileMergeScript.error) {
    console.error(fileMergeScript.error);
    return;
  }

  const pythonUploadScript = await exec(
    `py main.py --file="${FINAL_OUTPUT_FILE_PATH}" --title="Summer vacation in California" --description="Had fun surfing in Santa Cruz" --keywords="surfing,Santa Cruz" --category="22" --privacyStatus="private"`,
    {
      cwd: "py",
    }
  );

  if (pythonUploadScript.error) {
    console.error(pythonUploadScript.error);
    return;
  }

  console.log(pythonUploadScript.stdout);
};

(() => {
  fs.readdir(MAIN_VIDEO_PATH, async (err, files) => {
    if (err) {
      console.error(err);
    }

    // Create a new date which can be used for file matching
    // This date will be used to not confuse files
    // Because merging files and uploading files takes time
    // Date can change if I use `Date.now()` too many times
    const newDate = Date.now();

    // The final merged video file
    const OUTPUT_FILE_NAME = newDate + "output.mp4";

    // The path for the final video
    const FINAL_OUTPUT_FILE_PATH = `../${OUTPUT_FILE_NAME}`;

    // Filter all the other files other than `mp4` files
    files = files.filter((file) => file.match(/\.(mp4)$/));

    // A list of all file paths
    let list = "";

    for (let i = 0; i < files.length; i++) {
      list += `file ${files[i]}`;
      list += "\n";
    }

    const writeStream = fs.createWriteStream(LIST_FILE_PATH);

    writeStream.write(list);
    writeStream.end();

    await executeFileMergeAndUpload(OUTPUT_FILE_NAME, FINAL_OUTPUT_FILE_PATH);
  });
})();
