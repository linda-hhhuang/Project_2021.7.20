export interface ImportStudent {
  [index: string]: number | null | string;
  sid: number;
  type: string | null;
  maxReq: number | null;
}

export interface ImportTeacher {
  [index: string]: number | null | string;
  sid: number;
  job: string | null;
  organization: string | null;
}

export interface Student {
  [index: string]: number | null | string;
  sid: number;
  name: string;
  type: string | null;
  info: string | null;
  maxReq: number | null;
  sign: string;
}

export interface Teacher {
  [index: string]: number | null | string;
  sid: number;
  name: string;
  job: string | null;
  organization: string | null;
  sign: string;
  info: string | null;
}

export interface UpdateTeacher {
  [index: string]: number | null | string;
  name: string;
  job: string | null;
  organization: string | null;
  info: string | null;
}

export interface UpdateStudent {
  [index: string]: number | null | string;
  name: string;
  type: string | null;
  info: string | null;
  maxReq: number | null;
}
