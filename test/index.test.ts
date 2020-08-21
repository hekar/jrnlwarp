import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('jrnlwarp', () => {
  test
  .stdout()
  .do(() => cmd.run(['-h']))
  .it('runs help', ctx => {
    expect(ctx.stdout).to.contain('jrnlwarp')
  })
})
