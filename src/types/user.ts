export interface UserProfile {
  id: string
  username: string
  bio: string
  avatar_url: string
  follower_count: number
  following_count: number
  created_at: string
}

export interface UserResult {
  user_id: string
  username: string
  avatar_url: string
}

export interface UserSummary {
  id: string
  username: string
  displayName: string
  avatar?: string
  followersLabel?: string
}

export interface UserIdPage {
  user_ids: string[]
  next_cursor: string
}
