import simpleGit, {SimpleGit} from 'simple-git';
import AppConfig from './appconfig';

export default class GitRepo {
  config: AppConfig
  path: string
  git: SimpleGit

  constructor(appconfig: AppConfig, path: string) {
    this.config = appconfig
    this.path = path
    this.git = simpleGit();
  }
  
  async initIfNotExists() {
    await this.git.init()
    await this.git.addRemote('origin', this.config.gitRemote);
  }

  async status() {
    return await this.git.status({ baseRepo: this.path, })
  }

  async commitAndPush() {
    await this.git.add('*.md')
    await this.git.commit(`journal update ${new Date().toISOString()}`)
    return await this.git.push(
      'origin',
      'master',
      { baseRepo: this.path, })
  }
}