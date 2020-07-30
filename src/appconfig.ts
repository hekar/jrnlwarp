export default class AppConfig {
  journalFolder!: string;

  constructor(journalFolder: string) {
    this.journalFolder = journalFolder
  }
}
