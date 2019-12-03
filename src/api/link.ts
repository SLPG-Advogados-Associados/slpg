import { SchemaLink } from 'apollo-link-schema'
import { schema } from './schema'

const link = new SchemaLink({ schema })

export { link }
