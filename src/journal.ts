import * as path from 'path'
import {constants} from 'os'
import {AppConfig} from './app-config'
import ExternalEditor from './service/editor'
import {DateFormatter} from './service/date-formatter'
import {FileSystem} from './service/file-system'
import JournalReference from './journal-reference'

export default class Journal {
  private readonly fileSystem: FileSystem

  private readonly config: AppConfig

  readonly extension = '.md'

  readonly name: string

  readonly template: string

  constructor(
    dateFormatter: DateFormatter,
    fileSystem: FileSystem,
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

  async open(editor: ExternalEditor) {
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
