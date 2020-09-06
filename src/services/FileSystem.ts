import * as fs from 'fs-extra'

export interface IFileSystem {
  mkdirp(path: string): Promise<void>
  stat(path: string): Promise<fs.Stats>
  open(path: string, options: string): Promise<number>
  write(fd: number, content: string, seek: number, encoding: string): Promise<void>
  close(fd: number): Promise<void>
}

export default class FileSystem implements IFileSystem {
  mkdirp(path: string): Promise<void> {
    return fs.mkdir(path)
  }

  stat(path: string): Promise<fs.Stats> {
    return fs.stat(path)
  }

  open(path: string, options: string): Promise<number> {
    return fs.open(path, options)
  }

  async write(fd: number, content: string, seek: number, encoding: string) {
    fs.write(fd, content, seek, encoding)
  }

  async close(fd: number) {
    fs.close(fd)
  }
}