import * as path from 'path'
import * as fs from 'fs-extra'

export default class AppConfig {
  journalFolder!: string
  journalTemplate!: string

  static default(): AppConfig {
    const folder = path.join(
      process.env.HOME ?? '~', '.jrnlwrap')
    const template = [
      '```',
      '',
      '```',
    ].join('\n')
    const appConfig = new AppConfig(
      folder,
      template,
    )
    return appConfig
  }

  static async loadOrDefault(fullpath: string): Promise<AppConfig> {
    const exists = await fs.pathExists(fullpath)
    if (!exists) {
      return AppConfig.default()
    }

    const content = await fs.readJson(fullpath,
      { encoding: 'utf8' })

    return new AppConfig(
      content.folder,
      content.template,
    )
  }

  constructor(journalFolder: string, journalTemplate: string) {
    this.journalFolder = journalFolder
    this.journalTemplate = journalTemplate
  }
}
