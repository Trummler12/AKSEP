import { describe, it, expect } from 'vitest'
import { validate } from '../../modules/content-ensure'

describe('content-ensure', () => {
  it('checks ag_id on AG level', () => {
    const ok = validate({ _id: 'content/programm/ag-bildung/_index.mdc', ag_id: 1 })
    expect(ok.length).toBe(0)
    const err = validate({ _id: 'content/programm/ag-bildung/_index.mdc' })
    expect(err).toContain('ag_id missing')
  })

  it('checks thema_id on topic level', () => {
    const ok = validate({ _id: 'content/programm/ag-bildung/thema-x/_index.mdc', thema_id: 2 })
    expect(ok.length).toBe(0)
    const err = validate({ _id: 'content/programm/ag-bildung/thema-x/_index.mdc' })
    expect(err).toContain('thema_id missing')
  })

  it('checks kapitel_id on chapter files', () => {
    const ok = validate({ _id: 'content/programm/ag-bildung/thema-x/01.mdc', kapitel_id: 1 })
    expect(ok.length).toBe(0)
    const err = validate({ _id: 'content/programm/ag-bildung/thema-x/01.mdc' })
    expect(err).toContain('kapitel_id missing')
  })
})
