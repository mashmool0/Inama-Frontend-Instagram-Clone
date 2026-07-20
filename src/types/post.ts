export interface PostRecord {
  id: string
  author_id: string
  caption: string
  media_url: string
  like_count: number
  comment_count: number
  created_at: string
}

export interface PostPage {
  posts: PostRecord[]
  next_cursor: string
}

export interface CommentRecord {
  id: string
  post_id: string
  author_id: string
  body: string
  created_at: string
}

export interface CommentPage {
  comments: CommentRecord[]
  next_cursor: string
}

export interface PostViewModel {
  id: string
  author: {
    avatar?: string
    displayName: string
    username: string
  }
  image: string
  caption?: string
  likes: number
  comments: number
  timestamp: string
  isLiked?: boolean
  isSaved?: boolean
}
