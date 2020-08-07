import * as path from 'path'
import * as moment from 'moment'
import * as fs from 'fs-extra'
import {constants} from 'os'
import AppConfig from './appconfig'
import Editor from './editor'
import { rejects } from 'assert'

export default class Journal {
  private folder: string
  private template: string
  private date: Date
  private name: string
  private extension: string = '.md'

  constructor(config: AppConfig, date: Date) {
    this.folder = config.journalFolder
    this.template = config.journalTemplate
    this.date = date
    const namePrefix = 'jrnl'
    const dateSuffix = moment(date).format('YYYY-MM-DD')
    this.name = `${namePrefix}-${dateSuffix}`
  }

  async open(editor: Editor) {
    await this.createIfNotExists()
    await editor.open(this.fullpath())
  }

  async createIfNotExists() {
    await fs.mkdirp(this.folder)
    const fullpath = this.fullpath()
    let exists = false
    try {
      const stat = await fs.stat(fullpath)
      exists = stat.isFile()
    } catch (err) {
      switch (err.code) {
        case constants.errno.EACCES:
          console.error(err)
          throw err;
        default:
          exists = false
          break;
      }
    }

    if (!exists) {
      const fd = await fs.open(fullpath, 'w')
      await fs.write(fd, this.template, 0, 'utf-8')
      await fs.close(fd)
    }
  }

  fullpath() {
    return path.join(this.folder, this.name + this.extension)
  }
}
