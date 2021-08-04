import { Teacher } from './member';

//getlist
export interface Lesson {
  [index: string]: number | null | string | Teacher[] | Request[] | undefined;
  lid: number;
  code: string;
  title: string;
  description: string;
  maxPass: number;
  class: string;
  score: string;
  studentNum: string;
  type: string;
  term: string;
  Teachers: Teacher[];
  passCount: number;
  Requests?: Request[];
}

export interface Request {
  [index: string]: number | null | string | boolean;
  rid: number;
  pass: boolean;
  validated: boolean;
  info: string;
  studentSid: number;
  lessonLid: number;
}

//import&update lesson
export interface ImportLesson {
  [index: string]: number | null | string | number[] | undefined;
  code: string;
  title: string;
  description: string;
  maxPass: number;
  class: string;
  score: string;
  studentNum: string;
  type: string;
  term: string;
  teachers?: number[];
}
