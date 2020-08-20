import * as path from 'path'
import * as moment from 'moment'
import * as fs from 'fs-extra'
import {constants} from 'os'
import AppConfig from './appconfig'
import Editor from './editor'

export default class Journal {
  private folder: string

  private template: string

  private date: Date

  private name: string

  private title: string

  private extension = '.md'

  constructor(config: AppConfig, date: Date, title = '') {
    this.folder = config.journalFolder
    this.template = config.journalTemplate
      .replace('#{title}#', title)
      .replace('#{date}#', moment(date).format('YYYY-MM-DD'))
    this.date = date
    const namePrefix = 'jrnl'
    const dateSuffix = moment(date).format('YYYY-MM-DD')
    this.name = `${namePrefix}-${dateSuffix}`
    this.title = title
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
    } catch (error) {
      switch (error.code) {
      case constants.errno.EACCES:
        console.error(error)
        throw error
      default:
        exists = false
        break
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
