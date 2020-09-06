import * as path from 'path'
import * as fs from 'fs-extra'

export interface AppConfigSettings {
  journalFolder: string
  journalTemplate: string
  gitRemote: string
  gitBranch: string
}

export interface IAppConfig {
  settings: AppConfigSettings
}

export default class AppConfig implements IAppConfig {
  settings: AppConfigSettings

  static async loadOrDefault(fullpath: string): Promise<AppConfig> {
    const exists = await fs.pathExists(fullpath)
    if (!exists) {
      return AppConfig.default()
    }

    const content = await fs.readJson(fullpath,
      {encoding: 'utf8'})

    return new AppConfig({
      journalFolder: content.folder,
      journalTemplate: content.template,
      gitRemote: content.remote,
      gitBranch: content.branch,
    })
  }

  private static default(): AppConfig {
    const folder = path.join(
      process.env.HOME ?? '~', '.jrnlwarp')
    const template = [
      '```',
      'Title: #{title}#',
      'Date: #{date}#',
      'Tags:',
      'Memo:',
      '```',
    ].join('\n')
    const remote = 'git@github.com:hekar/jrnl.git'
    const branch = 'master'
    const appConfig = new AppConfig({
      journalFolder: folder,
      journalTemplate: template,
      gitRemote: remote,
      gitBranch: branch,
    })
    return appConfig
  }

  constructor(settings: AppConfigSettings) {
    this.settings = settings
  }
}
