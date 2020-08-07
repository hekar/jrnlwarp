import * as path from 'path'
import * as fs from 'fs-extra'

export default class AppConfig {
  journalFolder!: string
  journalTemplate!: string
  gitRemote!: string
  gitBranch!: string

  static default(): AppConfig {
    const folder = path.join(
      process.env.HOME ?? '~', '.jrnlwrap')
    const template = [
      '```',
      '',
      '```',
    ].join('\n')
    const remote = 'origin'
    const branch = 'master'
    const appConfig = new AppConfig(
      folder,
      template,
      remote,
      branch,
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
      content.remote,
      content.branch,
    )
  }

  constructor(
    folder: string,
    template: string,
    remote: string,
    branch: string) {
    this.journalFolder = folder
    this.journalTemplate = template
    this.gitRemote = remote
    this.gitBranch = branch
  }
}
