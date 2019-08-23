/**
 * Libraries/Frameworks
 * @private
 */
import express from 'express'
import fs from 'fs'

/**
 * utils
 * @private
 */
import youtubeToMp3 from '../utils/youtube_dl';

/**
 * Types
 * @private
 */
import {Request, Response, NextFunction} from 'express'


class Router {
  // type declarations
  router: any

  constructor() {
    this.router = express.Router()
  }

  /**
   * routes handler
   * @public
   */
  public routeHandler() {
    /**
     * receive youtube video url and convert
     * @public
     */
    this.router.get('/', async (request: Request, response: Response) => {
      const {videoUrl} = request.query
      if (!videoUrl) {
        return response.status(400).json({"error": 'fuck you asshole'})
      }
      const ytmp3 = new youtubeToMp3(videoUrl)
      ytmp3.verifyUrl(videoUrl)
      .then(() => {
        ytmp3.downloadOneFile()
        .then((mp3File) => {
          const file = `./mp3/${mp3File}`
          // response.download(file)

          response.writeHead(200, {
            "Content-Type": "audio/mpeg3;audio/x-mpeg-3;video/mpeg;video/x-mpeg;text/xml",
            "Content-Disposition": "attachment; filename=" + file
          });
          // fs.createReadStream(file).pipe(response);

          // response.setHeader('Content-Type', 'audio/mpeg3;audio/x-mpeg-3;video/mpeg;video/x-mpeg;text/xml')
          // response.setHeader("Content-Disposition", "attachment; filename=" + file)
          // response.status(200)
          // response.end()
        })
        // emit socket OK status here
      })
      .catch((error) => {
        return response.status(400).json({"error": error})
      })

    })

    return this.router

  }

}


export default new Router().routeHandler()
