export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  JSON: any,
  /** The `DateTime` scalar represents a date and time following the ISO 8601 standard */
  DateTime: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
  /** The `Long` scalar type represents 52-bit integers */
  Long: any,
};


export type Blog = {
   __typename?: 'Blog',
  title: Scalars['String'],
  body: Scalars['String'],
  summary?: Maybe<Scalars['String']>,
  image?: Maybe<UploadFile>,
  id: Scalars['ID'],
  created_at: Scalars['DateTime'],
  updated_at: Scalars['DateTime'],
};

export type BlogInput = {
  title: Scalars['String'],
  body: Scalars['String'],
  summary?: Maybe<Scalars['String']>,
  image?: Maybe<Scalars['ID']>,
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type CreateBlogInput = {
  data?: Maybe<BlogInput>,
};

export type CreateBlogPayload = {
   __typename?: 'createBlogPayload',
  blog?: Maybe<Blog>,
};

export type CreatePageInput = {
  data?: Maybe<PageInput>,
};

export type CreatePagePayload = {
   __typename?: 'createPagePayload',
  page?: Maybe<Page>,
};

export type CreateRoleInput = {
  data?: Maybe<RoleInput>,
};

export type CreateRolePayload = {
   __typename?: 'createRolePayload',
  role?: Maybe<UsersPermissionsRole>,
};

export type CreateUserInput = {
  data?: Maybe<UserInput>,
};

export type CreateUserPayload = {
   __typename?: 'createUserPayload',
  user?: Maybe<UsersPermissionsUser>,
};


export type DeleteBlogInput = {
  where?: Maybe<InputId>,
};

export type DeleteBlogPayload = {
   __typename?: 'deleteBlogPayload',
  blog?: Maybe<Blog>,
};

export type DeletePageInput = {
  where?: Maybe<InputId>,
};

export type DeletePagePayload = {
   __typename?: 'deletePagePayload',
  page?: Maybe<Page>,
};

export type DeleteRoleInput = {
  where?: Maybe<InputId>,
};

export type DeleteRolePayload = {
   __typename?: 'deleteRolePayload',
  role?: Maybe<UsersPermissionsRole>,
};

export type DeleteUserInput = {
  where?: Maybe<InputId>,
};

export type DeleteUserPayload = {
   __typename?: 'deleteUserPayload',
  user?: Maybe<UsersPermissionsUser>,
};

export type EditBlogInput = {
  title?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  summary?: Maybe<Scalars['String']>,
  image?: Maybe<Scalars['ID']>,
};

export type EditFileInput = {
  name?: Maybe<Scalars['String']>,
  hash?: Maybe<Scalars['String']>,
  sha256?: Maybe<Scalars['String']>,
  ext?: Maybe<Scalars['String']>,
  mime?: Maybe<Scalars['String']>,
  size?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
  provider?: Maybe<Scalars['String']>,
  provider_metadata?: Maybe<Scalars['JSON']>,
  related?: Maybe<Array<Maybe<Scalars['ID']>>>,
};

export type EditPageInput = {
  title?: Maybe<Scalars['String']>,
};

export type EditRoleInput = {
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  permissions?: Maybe<Array<Maybe<Scalars['ID']>>>,
  users?: Maybe<Array<Maybe<Scalars['ID']>>>,
};

export type EditUserInput = {
  username?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  provider?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  resetPasswordToken?: Maybe<Scalars['String']>,
  confirmed?: Maybe<Scalars['Boolean']>,
  blocked?: Maybe<Scalars['Boolean']>,
  role?: Maybe<Scalars['ID']>,
};

export type FileInput = {
  name: Scalars['String'],
  hash: Scalars['String'],
  sha256?: Maybe<Scalars['String']>,
  ext?: Maybe<Scalars['String']>,
  mime: Scalars['String'],
  size: Scalars['String'],
  url: Scalars['String'],
  provider: Scalars['String'],
  provider_metadata?: Maybe<Scalars['JSON']>,
  related?: Maybe<Array<Maybe<Scalars['ID']>>>,
};

export type InputId = {
  id: Scalars['ID'],
};



export type Morph = UsersPermissionsMe | UsersPermissionsMeRole | UsersPermissionsLoginPayload | Blog | CreateBlogPayload | UpdateBlogPayload | DeleteBlogPayload | Page | CreatePagePayload | UpdatePagePayload | DeletePagePayload | UploadFile | UsersPermissionsPermission | UsersPermissionsRole | CreateRolePayload | UpdateRolePayload | DeleteRolePayload | UsersPermissionsUser | CreateUserPayload | UpdateUserPayload | DeleteUserPayload;

export type Mutation = {
   __typename?: 'Mutation',
  createBlog?: Maybe<CreateBlogPayload>,
  updateBlog?: Maybe<UpdateBlogPayload>,
  deleteBlog?: Maybe<DeleteBlogPayload>,
  createPage?: Maybe<CreatePagePayload>,
  updatePage?: Maybe<UpdatePagePayload>,
  deletePage?: Maybe<DeletePagePayload>,
  /** Create a new role */
  createRole?: Maybe<CreateRolePayload>,
  /** Update an existing role */
  updateRole?: Maybe<UpdateRolePayload>,
  /** Delete an existing role */
  deleteRole?: Maybe<DeleteRolePayload>,
  /** Create a new user */
  createUser?: Maybe<CreateUserPayload>,
  /** Update an existing user */
  updateUser?: Maybe<UpdateUserPayload>,
  /** Delete an existing user */
  deleteUser?: Maybe<DeleteUserPayload>,
  upload: UploadFile,
  multipleUpload: Array<Maybe<UploadFile>>,
  login: UsersPermissionsLoginPayload,
  register: UsersPermissionsLoginPayload,
};


export type MutationCreateBlogArgs = {
  input?: Maybe<CreateBlogInput>
};


export type MutationUpdateBlogArgs = {
  input?: Maybe<UpdateBlogInput>
};


export type MutationDeleteBlogArgs = {
  input?: Maybe<DeleteBlogInput>
};


export type MutationCreatePageArgs = {
  input?: Maybe<CreatePageInput>
};


export type MutationUpdatePageArgs = {
  input?: Maybe<UpdatePageInput>
};


export type MutationDeletePageArgs = {
  input?: Maybe<DeletePageInput>
};


export type MutationCreateRoleArgs = {
  input?: Maybe<CreateRoleInput>
};


export type MutationUpdateRoleArgs = {
  input?: Maybe<UpdateRoleInput>
};


export type MutationDeleteRoleArgs = {
  input?: Maybe<DeleteRoleInput>
};


export type MutationCreateUserArgs = {
  input?: Maybe<CreateUserInput>
};


export type MutationUpdateUserArgs = {
  input?: Maybe<UpdateUserInput>
};


export type MutationDeleteUserArgs = {
  input?: Maybe<DeleteUserInput>
};


export type MutationUploadArgs = {
  refId?: Maybe<Scalars['ID']>,
  ref?: Maybe<Scalars['String']>,
  field?: Maybe<Scalars['String']>,
  source?: Maybe<Scalars['String']>,
  file: Scalars['Upload']
};


export type MutationMultipleUploadArgs = {
  refId?: Maybe<Scalars['ID']>,
  ref?: Maybe<Scalars['String']>,
  field?: Maybe<Scalars['String']>,
  source?: Maybe<Scalars['String']>,
  files: Array<Maybe<Scalars['Upload']>>
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput
};


export type MutationRegisterArgs = {
  input: UserInput
};

export type Page = {
   __typename?: 'Page',
  title?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  created_at: Scalars['DateTime'],
  updated_at: Scalars['DateTime'],
};

export type PageInput = {
  title?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  blog?: Maybe<Blog>,
  blogs?: Maybe<Array<Maybe<Blog>>>,
  page?: Maybe<Page>,
  pages?: Maybe<Array<Maybe<Page>>>,
  files?: Maybe<Array<Maybe<UploadFile>>>,
  role?: Maybe<UsersPermissionsRole>,
  /** Retrieve all the existing roles. You can't apply filters on this query. */
  roles?: Maybe<Array<Maybe<UsersPermissionsRole>>>,
  user?: Maybe<UsersPermissionsUser>,
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>,
  status: Scalars['Boolean'],
  me?: Maybe<UsersPermissionsMe>,
};


export type QueryBlogArgs = {
  id: Scalars['ID']
};


export type QueryBlogsArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};


export type QueryPageArgs = {
  id: Scalars['ID']
};


export type QueryPagesArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};


export type QueryFilesArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};


export type QueryRoleArgs = {
  id: Scalars['ID']
};


export type QueryRolesArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};


export type QueryUserArgs = {
  id: Scalars['ID']
};


export type QueryUsersArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};

export type RoleInput = {
  name: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  permissions?: Maybe<Array<Maybe<Scalars['ID']>>>,
  users?: Maybe<Array<Maybe<Scalars['ID']>>>,
};

export type UpdateBlogInput = {
  where?: Maybe<InputId>,
  data?: Maybe<EditBlogInput>,
};

export type UpdateBlogPayload = {
   __typename?: 'updateBlogPayload',
  blog?: Maybe<Blog>,
};

export type UpdatePageInput = {
  where?: Maybe<InputId>,
  data?: Maybe<EditPageInput>,
};

export type UpdatePagePayload = {
   __typename?: 'updatePagePayload',
  page?: Maybe<Page>,
};

export type UpdateRoleInput = {
  where?: Maybe<InputId>,
  data?: Maybe<EditRoleInput>,
};

export type UpdateRolePayload = {
   __typename?: 'updateRolePayload',
  role?: Maybe<UsersPermissionsRole>,
};

export type UpdateUserInput = {
  where?: Maybe<InputId>,
  data?: Maybe<EditUserInput>,
};

export type UpdateUserPayload = {
   __typename?: 'updateUserPayload',
  user?: Maybe<UsersPermissionsUser>,
};


export type UploadFile = {
   __typename?: 'UploadFile',
  name: Scalars['String'],
  hash: Scalars['String'],
  sha256?: Maybe<Scalars['String']>,
  ext?: Maybe<Scalars['String']>,
  mime: Scalars['String'],
  size: Scalars['String'],
  url: Scalars['String'],
  provider: Scalars['String'],
  provider_metadata?: Maybe<Scalars['JSON']>,
  related?: Maybe<Array<Maybe<Morph>>>,
  id: Scalars['ID'],
  created_at: Scalars['DateTime'],
  updated_at: Scalars['DateTime'],
};


export type UploadFileRelatedArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};

export type UserInput = {
  username: Scalars['String'],
  email: Scalars['String'],
  provider?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  resetPasswordToken?: Maybe<Scalars['String']>,
  confirmed?: Maybe<Scalars['Boolean']>,
  blocked?: Maybe<Scalars['Boolean']>,
  role?: Maybe<Scalars['ID']>,
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String'],
  password: Scalars['String'],
  provider?: Maybe<Scalars['String']>,
};

export type UsersPermissionsLoginPayload = {
   __typename?: 'UsersPermissionsLoginPayload',
  jwt: Scalars['String'],
  user: UsersPermissionsUser,
};

export type UsersPermissionsMe = {
   __typename?: 'UsersPermissionsMe',
  id: Scalars['ID'],
  username: Scalars['String'],
  email: Scalars['String'],
  confirmed?: Maybe<Scalars['Boolean']>,
  blocked?: Maybe<Scalars['Boolean']>,
  role?: Maybe<UsersPermissionsMeRole>,
};

export type UsersPermissionsMeRole = {
   __typename?: 'UsersPermissionsMeRole',
  id: Scalars['ID'],
  name: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
};

export type UsersPermissionsPermission = {
   __typename?: 'UsersPermissionsPermission',
  type: Scalars['String'],
  controller: Scalars['String'],
  action: Scalars['String'],
  enabled: Scalars['Boolean'],
  policy?: Maybe<Scalars['String']>,
  role?: Maybe<UsersPermissionsRole>,
  id: Scalars['ID'],
};

export type UsersPermissionsRole = {
   __typename?: 'UsersPermissionsRole',
  name: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  permissions?: Maybe<Array<Maybe<UsersPermissionsPermission>>>,
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>,
  id: Scalars['ID'],
};


export type UsersPermissionsRolePermissionsArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};


export type UsersPermissionsRoleUsersArgs = {
  sort?: Maybe<Scalars['String']>,
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>,
  where?: Maybe<Scalars['JSON']>
};

export type UsersPermissionsUser = {
   __typename?: 'UsersPermissionsUser',
  username: Scalars['String'],
  email: Scalars['String'],
  provider?: Maybe<Scalars['String']>,
  confirmed?: Maybe<Scalars['Boolean']>,
  blocked?: Maybe<Scalars['Boolean']>,
  role?: Maybe<UsersPermissionsRole>,
  id: Scalars['ID'],
  created_at: Scalars['DateTime'],
  updated_at: Scalars['DateTime'],
};

export type PostListItemFragment = (
  { __typename?: 'Blog' }
  & Pick<Blog, 'id' | 'title' | 'summary' | 'created_at'>
  & { image: Maybe<(
    { __typename?: 'UploadFile' }
    & Pick<UploadFile, 'url' | 'size'>
  )> }
);

export type BLOG_POST_QUERY_VARIABLES = {
  post: Scalars['ID']
};


export type BLOG_POST_QUERY = (
  { __typename?: 'Query' }
  & { post: Maybe<(
    { __typename?: 'Blog' }
    & Pick<Blog, 'id' | 'title' | 'created_at' | 'body'>
    & { image: Maybe<(
      { __typename?: 'UploadFile' }
      & Pick<UploadFile, 'url' | 'size'>
    )> }
  )> }
);

export type BLOG_QUERY_VARIABLES = {
  limit: Scalars['Int'],
  start: Scalars['Int']
};


export type BLOG_QUERY = (
  { __typename?: 'Query' }
  & { blogs: Maybe<Array<Maybe<(
    { __typename?: 'Blog' }
    & Pick<Blog, 'id'>
    & PostListItemFragment
  )>>> }
);

export type BLOG_LATEST_QUERY_VARIABLES = {};


export type BLOG_LATEST_QUERY = (
  { __typename?: 'Query' }
  & { blogs: Maybe<Array<Maybe<(
    { __typename?: 'Blog' }
    & Pick<Blog, 'id'>
    & PostListItemFragment
  )>>> }
);
