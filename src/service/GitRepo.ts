import simpleGit, {SimpleGit} from 'simple-git'
import { AppConfig } from '../AppConfig'

export interface IGitRepo {
  initIfNotExists(): Promise<void>
  status(): Promise<void>
  commitAndPush(): Promise<void>
}

export default class GitRepo {
  private readonly appConfig: AppConfig
  private readonly path: string
  private readonly git: SimpleGit

  constructor(appConfig: AppConfig, path: string) {
    this.appConfig = appConfig
    this.path = path
    this.git = simpleGit(this.path)
  }

  async initIfNotExists() {
    if (!await this.git.checkIsRepo()) {
      await this.git.init()
    }
  }

  async status() {
    return this.git.status()
  }

  async commitAndPush() {
    const statusList = await this.git.status()
    if (!statusList.isClean()) {
      await this.git.add('*.md')
      await this.git.commit(`journal update ${new Date().toISOString()}`)
    }
    await this.git.removeRemote('origin')
    await this.git.addRemote('origin', this.appConfig.gitRemote)
    return this.git.push('origin', 'master')
  }
}
