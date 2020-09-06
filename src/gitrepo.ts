import simpleGit, {SimpleGit} from 'simple-git'
import AppConfig from './appconfig'

export default class GitRepo {
  config: AppConfig

  path: string

  git: SimpleGit

  constructor(appconfig: AppConfig, path: string) {
    this.config = appconfig
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
    await this.git.addRemote('origin', this.config.settings.gitRemote)
    return this.git.push('origin', 'master')
  }
}
