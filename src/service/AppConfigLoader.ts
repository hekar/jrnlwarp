import * as path from 'path'
import { AppConfig } from '../AppConfig'
import { IFileSystem } from './FileSystem'

export interface IAppConfigLoader {
  loadOrDefault(fullpath: string): Promise<AppConfig>
}

export default class AppConfigLoader implements IAppConfigLoader {
  fileSystem: IFileSystem

  constructor(fileSystem: IFileSystem) {
    this.fileSystem = fileSystem
  }

  async loadOrDefault(fullpath: string): Promise<AppConfig> {
    const exists = await this.fileSystem.pathExists(fullpath)
    if (!exists) {
      return AppConfigLoader.default()
    }

    const content = await this.fileSystem.readJson(fullpath)

    return {
      journalFolder: content.folder,
      journalTemplate: content.template,
      gitRemote: content.remote,
      gitBranch: content.branch,
    }
  }

  static default(): AppConfig {
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
    return {
      journalFolder: folder,
      journalTemplate: template,
      gitRemote: remote,
      gitBranch: branch,
    }
  }
}
