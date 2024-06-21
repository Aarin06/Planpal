export interface Message {
  id: number;
  UserId: number;
  User: { username: string };
  content: string;
  upvote: number;
  downvote: number;
}
