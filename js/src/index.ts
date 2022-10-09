const fs = require("fs");
const promiseFs = require("fs/promises");
const path = require("path");
const { exec } = require("child-process-async");

const MAIN_VIDEO_PATH = path.resolve(__dirname, "../../videos");
const LIST_FILE_PATH = path.resolve(__dirname, "../../videos/list.txt");

const MAX_UPLOADS = 6;

const executeFileMergeAndUpload = async (
  OUTPUT_FILE_NAME: string,
  FINAL_OUTPUT_FILE_PATH: string,
  videoTitle: string,
  description: string
) => {
  console.log("Se combina fisierele video...");

  const fileMergeScript = await exec(
    `ffmpeg -safe 0 -f concat -i ${LIST_FILE_PATH} -c copy ${OUTPUT_FILE_NAME}`
  );

  if (fileMergeScript.error) {
    console.log("Oops. Am intampinat o erroare!");
    console.error(fileMergeScript.error);
    return;
  }

  console.log("Combinarea fisierelor a reusit!");
  console.log("Fisierul final se incarca pe YouTube!");

  const pythonUploadScript = await exec(
    `py main.py --file="${FINAL_OUTPUT_FILE_PATH}" --title="${videoTitle}" --category="10" --privacyStatus="private" --description="${description}"`,
    {
      cwd: "py",
    }
  );

  if (pythonUploadScript.error) {
    console.log("Oops. Am intampinat o erroare!");
    console.error(pythonUploadScript.error);
    return;
  }

  console.log(pythonUploadScript.stdout);
};

const generateRandomNumber = (max: number) => {
  return Math.round(Math.random() * max);
};

type CreateVideoTitleAndType = {
  randomArtist: string;
  typeOfVideo: string;
  isGeneratingVideoAge: boolean;
  videoAge: string;
  title: string;
};

const createVideoTitleAndType = (
  artists: string[],
  typesOfVideo: string[],
  videoAges: string[]
): CreateVideoTitleAndType => {
  const randomArtist = artists[generateRandomNumber(artists.length - 1)];
  const typeOfVideo = typesOfVideo[generateRandomNumber(typesOfVideo.length - 1)];

  const isGeneratingVideoAge = !!generateRandomNumber(1);
  const videoAge = videoAges[generateRandomNumber(videoAges.length - 1)];

  const title = `${typeOfVideo} ${randomArtist} - Colaj Manele ${isGeneratingVideoAge ? videoAge : ""}`;

  return {
    randomArtist,
    typeOfVideo,
    title,
    videoAge,
    isGeneratingVideoAge,
  };
};

const chooseTypeAndArtist = async () => {
  const data = await promiseFs
    .readFile(path.resolve(__dirname, "../../artists.txt"), "utf-8")
    .catch((error: any) => {
      console.error(error);
      return;
    });

  const readArtists = data.split(";").filter((artist: string) => artist !== "");
  let artists: string[] = [];

  for (const artist of readArtists) {
    const splitArtist = artist.split("\r\n");
    const splitArtistIdx = splitArtist.length > 1 ? 1 : 0;

    artists.push(splitArtist[splitArtistIdx]);
  }

  const typesOfVideo = ["Best Of", "Top 10", "Manele De Dragoste"];
  const videoAges = ["vechi", "noi"];

  return createVideoTitleAndType(artists, typesOfVideo, videoAges);
};

type FilterFilesByTypeAndArtist = {
  files: string[];
  generatedData: CreateVideoTitleAndType;
};

const filterFilesByTypeAndArtist = async (
  files: string[],
  typeAndArtist: CreateVideoTitleAndType
): Promise<FilterFilesByTypeAndArtist> => {
  const { randomArtist, typeOfVideo, videoAge, isGeneratingVideoAge } = typeAndArtist;

  let tempFiles;

  // Filter all the other files other than `mp4` files
  tempFiles = files.filter((file) => file.match(/\.(mp4)$/));

  // Filter Files By artist
  tempFiles = tempFiles.filter((file) => {
    const [artistName] = file.split("_");

    return randomArtist.replace(/\s+/g, "") === artistName ? file : null;
  });

  // Filter Files By Type
  tempFiles = tempFiles.filter((file) => {
    const [_, type] = file.split("_");

    return typeOfVideo.replace(/\s+/g, "") === type ? file : null;
  });

  if (!tempFiles.length) return filterFilesByTypeAndArtist(files, await chooseTypeAndArtist());
  if (!isGeneratingVideoAge) return { files: tempFiles, generatedData: typeAndArtist };

  // Filter files by video age
  tempFiles = tempFiles.filter((file) => {
    const [_, __, currentVideoAge] = file.split("_");

    return currentVideoAge === videoAge ? file : null;
  });

  if (!tempFiles.length) {
    return filterFilesByTypeAndArtist(files, await chooseTypeAndArtist());
  }

  return { files: tempFiles, generatedData: typeAndArtist };
};

const generateTimeStamps = async (allFileNames: string[]) => {
  const songNamesPath = path.resolve(__dirname, "../../songNames.txt");
  let videoTimestamps: string[] = [];

  const data = await promiseFs.readFile(songNamesPath, "utf-8").catch((error: any) => {
    console.error(error);
    return;
  });
  let finalFiles: string[] = [];

  data.split(";").forEach((songLine: string) => {
    const splitLine = songLine.split("\r\n");

    finalFiles.push(splitLine.length > 1 ? splitLine[1] : splitLine[0]);
  });
  finalFiles = finalFiles.filter((line) => line !== "");

  for (const fileName of allFileNames) {
    fileName.replace("\n", "");
    const filePath = path.resolve(__dirname, `../../videos/${fileName}`);

    const currentSongName =
      finalFiles[
        finalFiles.findIndex((file) => file.split("=")[0] === fileName.replace(/\.(mp4)$/, ""))
      ].split("=")[1];

    const { stdout, error } = await exec(
      `ffprobe -i ${filePath} -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1 -sexagesimal`
    );
    if (error) {
      console.error(error);
      return;
    }

    const [hours, minutes, seconds] = stdout.split(":");

    if (videoTimestamps.length <= 0) {
      videoTimestamps.push(`0:00:00 - ${currentSongName}`);
    } else {
      const parsedTime = `${hours}:${minutes}:${seconds.replace(/\..*/, "")}`;
      const prevTime = videoTimestamps[videoTimestamps.length - 1].split("-")[0];

      let calculatedTime: string = "";

      parsedTime.split(":").forEach((time, timeIdx) => {
        const prevTimeVal = prevTime.split(":")[timeIdx];

        const timeSum = parseInt(time) + parseInt(prevTimeVal);

        calculatedTime += timeSum.toString().length <= 1 ? `0${timeSum.toString()}` : timeSum.toString();

        if (timeIdx === parsedTime.split(":").length - 1) return;
        calculatedTime += ":";
      });

      videoTimestamps.push(`${calculatedTime} - ${currentSongName}`);
    }
  }

  return videoTimestamps;
};

const main = () => {
  fs.readdir(MAIN_VIDEO_PATH, async (err: any, files: string[]) => {
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

    const filterData = await filterFilesByTypeAndArtist(files, await chooseTypeAndArtist());
    files = filterData.files;

    const generatedVideoData = filterData.generatedData;

    const timeStamps = await generateTimeStamps(files);

    // A list of all file paths
    let list = "";

    for (let i = 0; i < files.length; i++) {
      list += `file ${files[i]}`;
      list += "\n";
    }

    const writeStream = fs.createWriteStream(LIST_FILE_PATH);

    writeStream.write(list);
    writeStream.end();

    const description = `Description\\${generatedVideoData.title}\\#${
      generatedVideoData.randomArtist
    } #manele #colajnou #colaj #slmnet\\${timeStamps?.map((stamp) => `${stamp}\\`).join("")}`;

    await executeFileMergeAndUpload(
      OUTPUT_FILE_NAME,
      FINAL_OUTPUT_FILE_PATH,
      generatedVideoData.title,
      description
    );
  });
};

(() => {
  let uploads = 0;

  const uploadInterval = setInterval(() => {
    uploads += 1;
    console.log(`${MAX_UPLOADS - uploads} Videoclipuri ramase pe ziua de azi`);

    if (uploads >= MAX_UPLOADS) {
      clearInterval(uploadInterval);
      console.log("Ai ajuns la limita maxima de upload-uri pe zi.");
      console.log("Ruleaza programul maine!");
    }

    main();
  }, 10000 * 6 * 60);
})();
