module.exports = {
  overwrite: true,
  schema: 'http://localhost:1337/graphql',
  documents: './src/**/*.gql',
  pluginLoader,
  generates: {
    'src/api/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    'src/api/generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
    'src/api/generated/fragment-matcher-introspection.ts': {
      plugins: ['fragment-matcher'],
    },
  },
}

function pluginLoader(name) {
  const plugin = require(name)

  /**
   * Override typescript-operations plugin to enforce
   * capitalized types.
   *
   * ex.:
   *   query "query LOGIN_PAGE"
   *   would generate types "Login_PageQuery" and "Login_PageQueryVariables"
   *   now generates types "LOGIN_PAGE_QUERY" and "LOGIN_PAGE_QUERY_VARIABLES"
   */
  if (name === '@graphql-codegen/typescript-operations') {
    return {
      plugin: (schema, operations, ...rest) => {
        const result = plugin.plugin(schema, operations, ...rest)
        const operationNames = []

        for (const { content } of operations) {
          for (const { kind, name, operation } of content.definitions) {
            if (kind === 'OperationDefinition') {
              operationNames.push([
                // ex.: INVITATION_PAGE
                name.value,
                // ex.: "query" => "QUERY"
                operation.toUpperCase(),
              ])
            }
          }
        }

        return operationNames.reduce(
          (carry, [name, type]) =>
            carry
              .replace(
                new RegExp(`type ${name}${type}Variables`, 'giu'),
                `type ${name}_${type}_VARIABLES`
              )
              .replace(
                new RegExp(`type ${name}${type}`, 'giu'),
                `type ${name}_${type}`
              ),
          result
        )
      },
    }
  }

  return plugin
}
