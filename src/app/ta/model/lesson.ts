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

export type Request = {
  [index: string]: number | null | string | Student | undefined | boolean;
  aid: number;
  rid: number;
  isDeleted: boolean;
  manual: boolean;
  pass: boolean;
  validated: boolean;
  deduction: boolean;
  deductTime: string;
  lessonLid: number;
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
  studentSid: number;
  Student: Student;
};

export type InnerRequest = {
  [index: string]: number | null | string | undefined | boolean;
  deduction: boolean;
  deductTime: string;
  lessonLid: number | null;
  studentComment: string;
};

export type OuterRequest = {
  [index: string]: number | null | string | undefined | boolean;
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
  studentComment: string;
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
  teachers: string;
  teacherJobs: string;
}

export interface RequestList {
  [index: string]: number | null | string | boolean | Lesson | Student;
  rid: number;
  manual: boolean;
  isDeleted: boolean;
  pass: boolean;
  validated: boolean;
  lessonTitle: string;
  lessonLid: number | null;
  Student: Student;
}

export interface TeacherOwnLesson {
  [index: string]: number | null | string | boolean | undefined;
  aid: number;
  lid: number;
  code: string;
  title: string;
  description: string;
  class: string;
  score: string;
  studentNum: string;
  type: string;
  term: string;
  teachers: string;
  teacherJobs: string;
  maxPass: number;
  full: boolean;
  pass: number;
  all: number;
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
