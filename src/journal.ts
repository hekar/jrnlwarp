import * as path from 'path'
import {constants} from 'os'
import AppConfig, { IAppConfig, AppConfigSettings } from './appconfig'
import Editor from './editor'
import { IDateFormatter } from './services/DateFormatter'
import { IFileSystem } from './services/FileSystem'

export default class Journal {
  private readonly fileSystem: IFileSystem
  private readonly settings: AppConfigSettings

  readonly date: Date
  readonly extension = '.md'
  readonly name: string
  readonly template: string
  readonly title: string

  constructor(
    dateFormatter: IDateFormatter,
    fileSystem: IFileSystem,
    config: IAppConfig,
    date: Date,
    title = ''
  ) {
    const formattedDate = dateFormatter.format(date)
    this.fileSystem = fileSystem
    this.settings = config.settings
    this.template = this.settings.journalTemplate
      .replace('#{title}#', title)
      .replace('#{date}#', formattedDate)
    this.date = date
    const namePrefix = 'jrnl'
    const dateSuffix = formattedDate
    this.name = `${namePrefix}-${dateSuffix}`
    this.title = title
  }

  async open(editor: Editor) {
    await this.createIfNotExists()
    await editor.open(this.fullpath())
  }

  async createIfNotExists() {
    await this.fileSystem.mkdirp(this.settings.journalFolder)
    const fullpath = this.fullpath()
    let exists = false
    try {
      const stat = await this.fileSystem.stat(fullpath)
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
      const fd = await this.fileSystem.open(fullpath, 'w')
      await this.fileSystem.write(fd, this.template, 0, 'utf-8')
      await this.fileSystem.close(fd)
    }
  }

  fullpath() {
    return path.join(
      this.settings.journalFolder,
      this.name + this.extension)
  }
}
