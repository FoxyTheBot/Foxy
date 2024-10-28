import { Attachment } from "discordeno/transformers";
import { ImageConstants } from "../utils/ImageConstants";
import { Readable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import fs from 'fs';
import { promisify } from 'util';
import fetch from 'node-fetch';
import path from 'path';
import { logger } from "../../../../../../common/utils/logger";

const unlinkAsync = promisify(fs.unlink);

export default class EminemVideoGenerator {
  private MAX_AUDIO_SIZE: number = 1024 * 1024 * 8;

  async generateVideo(audio: Attachment): Promise<Readable> {
    if (!audio.contentType?.startsWith("audio") && !audio.contentType?.startsWith("video")) {
      throw new Error("Invalid file type provided. Must be audio or video.");
    }

    if (audio.size > this.MAX_AUDIO_SIZE) {
      throw new Error("Audio or video file is too large. Max size is 10 MB.");
    }

    try {
      const timestamp = Date.now();
      const audioTempPath = path.join(__dirname, `audio_temp_${timestamp}.mp3`);
      const videoTempPath = path.join(__dirname, `video_temp_${timestamp}.mp4`);
      const outputTempPath = path.join(__dirname, `output_video_${timestamp}.mp4`);

      if (audio.contentType.startsWith("video")) {
        await this.saveToFile(audio.url, videoTempPath);
        await this.extractAudio(videoTempPath, audioTempPath);
      } else {
        await this.saveToFile(audio.url, audioTempPath);
      }

      await this.saveToFile(ImageConstants.EMINEM_VIDEO, videoTempPath);

      const output = new Readable({ read() {} });

      ffmpeg(videoTempPath)
        .input(audioTempPath)
        .complexFilter(`
          [0:a]atrim=0:10[a0]; 
          [1:a]atrim=0:9[a1]; 
          [a0][a1]concat=n=2:v=0:a=1[a]; 
          [0:v]trim=duration=19[v]
        `)
        .outputOptions(["-map [v]", "-map [a]", "-shortest", `-threads ${process.env.FFMPEG_THREADS}`, `-preset ${process.env.FFMPEG_PRESET}`])
        .save(outputTempPath)
        .on('end', async () => {
          const fileStream = fs.createReadStream(outputTempPath);
          fileStream.on('data', chunk => output.push(chunk));
          fileStream.on('end', async () => {
            output.push(null);
            Promise.all([
              unlinkAsync(audioTempPath),
              unlinkAsync(videoTempPath),
              unlinkAsync(outputTempPath)
            ]);
          });
        })
        .on('error', async (err) => {
          logger.error("Error generating video:", err);
          Promise.all([
            unlinkAsync(audioTempPath),
            unlinkAsync(videoTempPath),
            unlinkAsync(outputTempPath)
          ]);
          throw new Error("An error occurred while generating the video.");
        });

      return output; 
    } catch (error) {
      logger.error("Error generating video:", error);
      throw new Error("An error occurred while generating the video.");
    }
  }

  private async extractAudio(videoPath: string, audioPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  private async saveToFile(url: string, filePath: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    await fs.promises.writeFile(filePath, buffer);
  }
}
