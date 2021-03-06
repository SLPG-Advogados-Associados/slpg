import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '~api/schema/context';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  JSON: any,
};

export type Image = {
   __typename?: 'Image',
  url: Scalars['String'],
  size: Scalars['String'],
};

export type Interest = {
   __typename?: 'Interest',
  id: Scalars['String'],
  name: Scalars['String'],
};


export type Member = {
   __typename?: 'Member',
  id: Scalars['String'],
  slug: Scalars['String'],
  name: Scalars['String'],
  oab: Scalars['String'],
  photo: Scalars['String'],
  role: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  contact: Scalars['Boolean'],
  status: Scalars['Boolean'],
  subscribe: Scalars['Boolean'],
};


export type MutationContactArgs = {
  name: Scalars['String'],
  phone?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  message: Scalars['String']
};


export type MutationSubscribeArgs = {
  email: Scalars['String'],
  name: Scalars['String'],
  interests: Array<Scalars['String']>
};

export type Post = {
   __typename?: 'Post',
  id: Scalars['String'],
  slug: Scalars['String'],
  title: Scalars['String'],
  summary: Scalars['String'],
  body: Scalars['String'],
  date: Scalars['String'],
  image?: Maybe<Image>,
};

export type PostsResult = {
   __typename?: 'PostsResult',
  id: Scalars['String'],
  count: Scalars['Int'],
  total: Scalars['Int'],
  items: Array<PostsResultItem>,
};

export type PostsResultItem = {
   __typename?: 'PostsResultItem',
  id: Scalars['String'],
  item: Post,
};

export type Query = {
   __typename?: 'Query',
  posts: PostsResult,
  postById?: Maybe<Post>,
  version: Scalars['String'],
  interests: Array<Interest>,
  team: Array<Member>,
  member?: Maybe<Member>,
};


export type QueryPostsArgs = {
  limit?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['Int']>
};


export type QueryPostByIdArgs = {
  id: Scalars['String']
};


export type QueryMemberArgs = {
  id: Scalars['String']
};

export type PostListItemFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'slug' | 'title' | 'summary' | 'date'>
  & { image: Maybe<(
    { __typename?: 'Image' }
    & Pick<Image, 'url'>
  )> }
);

export type NEWSLETTER_INTERESTS_QUERY_VARIABLES = {};


export type NEWSLETTER_INTERESTS_QUERY = (
  { __typename?: 'Query' }
  & { interests: Array<(
    { __typename?: 'Interest' }
    & Pick<Interest, 'id' | 'name'>
  )> }
);

export type SUBSCRIBE_MUTATION_VARIABLES = {
  name: Scalars['String'],
  email: Scalars['String'],
  interests: Array<Scalars['String']>
};


export type SUBSCRIBE_MUTATION = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'subscribe'>
);

export type BLOG_QUERY_VARIABLES = {
  limit: Scalars['Int'],
  start: Scalars['Int']
};


export type BLOG_QUERY = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PostsResult' }
    & Pick<PostsResult, 'id'>
    & { items: Array<(
      { __typename?: 'PostsResultItem' }
      & Pick<PostsResultItem, 'id'>
      & { item: (
        { __typename?: 'Post' }
        & Pick<Post, 'id'>
        & PostListItemFragment
      ) }
    )> }
  ) }
);

export type CONTACT_MUTATION_VARIABLES = {
  name: Scalars['String'],
  message: Scalars['String'],
  phone?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>
};


export type CONTACT_MUTATION = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'contact'>
);

export type BLOG_LATEST_QUERY_VARIABLES = {};


export type BLOG_LATEST_QUERY = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PostsResult' }
    & Pick<PostsResult, 'id'>
    & { items: Array<(
      { __typename?: 'PostsResultItem' }
      & Pick<PostsResultItem, 'id'>
      & { item: (
        { __typename?: 'Post' }
        & Pick<Post, 'id'>
        & PostListItemFragment
      ) }
    )> }
  ) }
);

export type BLOG_POST_QUERY_VARIABLES = {
  slug: Scalars['String']
};


export type BLOG_POST_QUERY = (
  { __typename?: 'Query' }
  & { post: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'slug' | 'body' | 'summary' | 'title' | 'date'>
    & { image: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'url'>
    )> }
  )> }
);

export type TEAM_QUERY_VARIABLES = {};


export type TEAM_QUERY = (
  { __typename?: 'Query' }
  & { team: Array<(
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'slug' | 'name' | 'role' | 'oab' | 'photo'>
  )> }
);



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  Int: ResolverTypeWrapper<any>,
  PostsResult: ResolverTypeWrapper<any>,
  String: ResolverTypeWrapper<any>,
  PostsResultItem: ResolverTypeWrapper<any>,
  Post: ResolverTypeWrapper<any>,
  Image: ResolverTypeWrapper<any>,
  Interest: ResolverTypeWrapper<any>,
  Member: ResolverTypeWrapper<any>,
  Mutation: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<any>,
  JSON: ResolverTypeWrapper<any>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  Int: any,
  PostsResult: any,
  String: any,
  PostsResultItem: any,
  Post: any,
  Image: any,
  Interest: any,
  Member: any,
  Mutation: {},
  Boolean: any,
  JSON: any,
};

export type ImageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  size?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type InterestResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Interest'] = ResolversParentTypes['Interest']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type MemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  oab?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  photo?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  contact?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationContactArgs, 'name' | 'message'>>,
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  subscribe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSubscribeArgs, 'email' | 'name' | 'interests'>>,
};

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>,
};

export type PostsResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostsResult'] = ResolversParentTypes['PostsResult']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  items?: Resolver<Array<ResolversTypes['PostsResultItem']>, ParentType, ContextType>,
};

export type PostsResultItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostsResultItem'] = ResolversParentTypes['PostsResultItem']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  item?: Resolver<ResolversTypes['Post'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  posts?: Resolver<ResolversTypes['PostsResult'], ParentType, ContextType, QueryPostsArgs>,
  postById?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostByIdArgs, 'id'>>,
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  interests?: Resolver<Array<ResolversTypes['Interest']>, ParentType, ContextType>,
  team?: Resolver<Array<ResolversTypes['Member']>, ParentType, ContextType>,
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberArgs, 'id'>>,
};

export type Resolvers<ContextType = Context> = {
  Image?: ImageResolvers<ContextType>,
  Interest?: InterestResolvers<ContextType>,
  JSON?: GraphQLScalarType,
  Member?: MemberResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Post?: PostResolvers<ContextType>,
  PostsResult?: PostsResultResolvers<ContextType>,
  PostsResultItem?: PostsResultItemResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
