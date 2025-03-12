export enum MetadataSortingByEnum {
  Id = 'reqId',
  Title = 'title',
  H1 = 'h1',
  Url = 'url',
  Description = 'description',
  Keywords = 'keywords',
  Subtitle = 'subtitle',
}

export enum PostsSortingByEnum {
  Id = 'reqId',
  Title = 'title',
  Author = 'author',
  'Author position' = 'author position',
  Created = 'createdAt',
}

export enum FeedbacksSortingEnum {
  Id = 'reqId',
  Name = 'name',
  Email = 'email',
  File = 'file',
  Type = 'type',
  Status = 'status',
}

export const sortingFields = {
  ...MetadataSortingByEnum,
  ...PostsSortingByEnum,
  ...FeedbacksSortingEnum,
};

export type TSortingFields =
  | keyof typeof MetadataSortingByEnum
  | keyof typeof PostsSortingByEnum
  | keyof typeof FeedbacksSortingEnum;
