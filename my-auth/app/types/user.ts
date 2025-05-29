
export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  posts:string[];
  surveys:string[];
  activities:string[];
  profileImage: string;
  savedPosts:string[];
  savedActivity:string[];
  followers: string[];
  following: string[];
}

 export interface Post {
    _id: string;
    content: string;
    tags: string[];
    image?: string;
    createdAt: string;
    comments: string[];
    likes: string[];
    user: { _id: string; name: string; profileImage: string; email: string };
  }
 export interface Choice {
    text: string;
    voters: string[];
    _id: string;
  }
export  interface Survey{
    _id:string;
    question:string;
    choices:Choice[];
    duration:{
        days:number;
        hours:number;
        minutes:number;
    }
    creator:{
      _id: string;
      name:string,
      email:string;
      profileImage:string
    };
    likes: string[];
    comments: string[];
    endDate:Date;
    isActive: boolean;
    createdAt:Date;
  }
 export interface Activity{
    _id:string;
    activityName: string;
      activityType: string;
      description: string;
      image?: string;
      creator: {
        _id:string;
        email:string;
        profileImage: string;
        name: string;
      };
      activityDate: {
        hours: number;
        minutes: number;
      };
      subscribeUsers: string[];
      startDate: Date;
      isActive: boolean;
      createdAt:Date;
  }

 export interface FollowingProps {
    _id:string,
    name:string,
    email:string,
    profileImage:string,
    followers:string[],
    following:string[],
    bio:string
  }
 export type CommentType = {
  _id: string;
  content: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profileImage: string;
  };
};


export type NotificationType={
userId:string,
senderId:string,
postId:string,
type:string,
message:string,
notification:string,
createdAt:Date
}