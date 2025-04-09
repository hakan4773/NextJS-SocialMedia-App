export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
  }
export interface UserType {
  _id: number;
  name: string;
  email: string;
  password: string;
  bio: string;
  profileImage: string;
  followers: string[];
  following: string[];
}

 export interface Post {
    id: number;
    content: string;
    tags: string[];
    image?: string;
    createdAt: string;
    comments: string[];
    likes: number;
    user: { name: string; profileImage: string; email: string };
  }
export  interface Survey{
    _id:string;
    question:string;
    choices:{
         text: string;
          voters: string[];
    };
    duration:{
        days:number;
        hours:number;
        minutes:number;
    }
    creator:string;
    endDate:Date;
    isActive: boolean;
  }
 export interface Activity{
    activityName: string;
      activityType: string;
      description: string;
      creator: {
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