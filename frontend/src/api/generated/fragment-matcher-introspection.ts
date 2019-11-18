export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string
      name: string
      possibleTypes: {
        name: string
      }[]
    }[]
  }
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'Morph',
        possibleTypes: [
          {
            name: 'UsersPermissionsMe',
          },
          {
            name: 'UsersPermissionsMeRole',
          },
          {
            name: 'UsersPermissionsLoginPayload',
          },
          {
            name: 'Blog',
          },
          {
            name: 'createBlogPayload',
          },
          {
            name: 'updateBlogPayload',
          },
          {
            name: 'deleteBlogPayload',
          },
          {
            name: 'UploadFile',
          },
          {
            name: 'UsersPermissionsPermission',
          },
          {
            name: 'UsersPermissionsRole',
          },
          {
            name: 'createRolePayload',
          },
          {
            name: 'updateRolePayload',
          },
          {
            name: 'deleteRolePayload',
          },
          {
            name: 'UsersPermissionsUser',
          },
          {
            name: 'createUserPayload',
          },
          {
            name: 'updateUserPayload',
          },
          {
            name: 'deleteUserPayload',
          },
        ],
      },
    ],
  },
}
export default result
