
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
    likes: number;
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
      profileImage:string
    };
    endDate:Date;
    isActive: boolean;
    createdAt:Date;
  }
 export interface Activity{
    activityName: string;
      activityType: string;
      description: string;
      creator: {
        _id:string;
        profileImage: string;
        name: string;
      };
      activityDate: {
        hours: number;
        minutes: number;
      };
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
 