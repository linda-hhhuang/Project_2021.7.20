import { Teacher } from './member';
import { Student } from './member';
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
  passCount?: number;
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

export type newRequest = {
  rid: number;
  pass: boolean;
  validated: boolean;
  deduction: boolean;
  deductTime: string;
  lessonTitle: string;
  lessonCode: string;
  lessonTerm: string;
  lessonClass: string;
  lessonScore: string;
  lessonStudentNum: string;
  lessonType: string;
  teacherName: string;
  teacherJob: string;
  teacherOrganization: string;
  teacherComment: string;
  teacherSign: string;
  studentComment: string;
  studentSign: string;
  studentSid: number;
};

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

export interface StudentRequest {
  [index: string]: number | null | string | boolean | Lesson | Student;
  rid: number;
  pass: boolean;
  validated: boolean;
  deduction: boolean;
  deductTime: string;
  teacherComment: string;
  studentComment: string;
  studnetPhone: string;
  studentEmail: string;
  studentSid: number;
  lessonLid: number;
  Lesson: Lesson;
  Student: Student;
}

export interface TeacherOwnLesson {
  [index: string]:
    | number
    | null
    | string
    | TeacherOwnLessonRequest[]
    | undefined;
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
  passCount: number;
  Requests: TeacherOwnLessonRequest[];
}

export interface TeacherOwnLessonRequest {
  [index: string]: number | null | string | boolean | TeacherOwnLessonStudent;
  rid: number;
  pass: boolean;
  validated: boolean;
  deduction: boolean;
  deductTime: string;
  teacherComment: string;
  studentComment: string;
  studnetPhone: string;
  studentEmail: string;
  studentSid: number;
  lessonLid: number;
  Student: TeacherOwnLessonStudent;
}

export interface TeacherOwnLessonStudent {
  [index: string]: number | null | string;
  sid: number;
  name: string;
}
