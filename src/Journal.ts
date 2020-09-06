import * as path from 'path'
import {constants} from 'os'
import AppConfigLoader, { IAppConfigLoader } from './service/AppConfigLoader'
import { AppConfig } from "./AppConfig"
import Editor from './service/Editor'
import { IDateFormatter } from './service/DateFormatter'
import { IFileSystem } from './service/FileSystem'
import JournalReference from './JournalReference'

export default class Journal {
  private readonly fileSystem: IFileSystem
  private readonly config: AppConfig

  readonly extension = '.md'
  readonly name: string
  readonly template: string

  constructor(
    dateFormatter: IDateFormatter,
    fileSystem: IFileSystem,
    config: AppConfig,
    ref: JournalReference
  ) {
    const formattedDate = dateFormatter.format(ref.date)
    this.fileSystem = fileSystem
    this.config = config
    this.template = config.journalTemplate
      .replace('#{title}#', ref.title)
      .replace('#{date}#', formattedDate)
    const namePrefix = 'jrnl'
    const dateSuffix = formattedDate
    this.name = `${namePrefix}-${dateSuffix}`
  }

  async open(editor: Editor) {
    await this.createIfNotExists()
    await editor.open(this.fullpath())
  }

  async createIfNotExists() {
    await this.fileSystem.mkdirp(this.config.journalFolder)
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
      this.config.journalFolder,
      this.name + this.extension)
  }
}
