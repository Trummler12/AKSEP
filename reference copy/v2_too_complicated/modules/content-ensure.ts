import { defineNuxtModule } from 'nuxt/kit'

export interface ContentFile {
  _id: string
  [key: string]: any
}

/**
 * Validate required IDs based on file path.
 */
export function validate (file: ContentFile): string[] {
  const errors: string[] = []
  const id = file._id
  if (/^content\/programm\/ag-[^/]+\/_index\.mdc$/.test(id)) {
    if (typeof file.ag_id !== 'number') { errors.push('ag_id missing') }
  } else if (/^content\/programm\/ag-[^/]+\/[^/]+\/_index\.mdc$/.test(id)) {
    if (typeof file.thema_id !== 'number') { errors.push('thema_id missing') }
  } else if (/^content\/programm\/ag-[^/]+\/[^/]+\/[^/]+\.mdc$/.test(id)) {
    if (typeof file.kapitel_id !== 'number') { errors.push('kapitel_id missing') }
  }
  return errors
}

export default defineNuxtModule({
  setup (_, nuxt) {
    nuxt.hook('content:file:beforeParse', (file: any) => {
      const errors = validate(file as ContentFile)
      if (errors.length) {
        throw new Error(`Content validation failed for ${file._id}: ${errors.join(', ')}`)
      }
    })
  }
})
