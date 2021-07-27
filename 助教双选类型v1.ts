namespace User {
  export enum UserRole {
    Admin, // 管理员
    EduAdmin, // 教务
    Teacher, // 教师
    Student, // 校内学生
    Other, // 校外学生
  }

  export interface Entity {
    // 用户基类型
    uid: number;
    email: string | null;
    phone: string | null;
    sid: number | null;
    netid: string | null;
    name: string;
    role: UserRole;
    password: string;
  }
}

namespace Member {
  export interface StudentEntity {
    sid: number;
    name: string;
    type: string; // 学生类别
    info: string; // 个人介绍
    maxReq: number; // 最大请求数
  }

  export interface TeacherEntity {
    sid: number;
    name: string;
    job: string; // 职称
    organization: string; // 学院
    info: string; // 个人介绍
  }
}

namespace Lesson {
  export interface Entity {
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
  }
}

namespace Request {
  export interface Entity{
    rid: number
    pass: boolean
    validated: boolean
    info: string
    studentSid: number
    lessonLid: number
  }
}

namespace Payload {
  /**
   * 所有response会用以下类型包装
   * 1. msg可用于给用户展示提示
   * 2. body为具体承载的数据比如用户列表等
   * 3. err暂时没有用到
   */
  interface MsgBody {
    body: any;
    msg: string;
    err?: any;
  }

  /**
   * 所有/user下的接口返回的用户个体都使用这个类型
   * - GET /user/login
   * - POST /user/login
   * - ...
   */
  type User = Omit<User.Entity, "password">;

  /**
   * 所有/member下的GET接口的response，使用以下两种类型表示老师
   */
  type Student = Member.StudentEntity;
  type Teacher = Member.TeacherEntity;

  /**
   * 所有/member下导入接口，用以下两种类型
   * 
   * 其实就是去掉info和name的老师和学生实体
   */
  type StudentImport = Omit<Member.StudentEntity, "info" | "name">[];
  type TeacherImport = Omit<Member.TeacherEntity, "info" | "name">[];

  /**
   * 所有/member下的更新个人信息接口，都使用这个类型
   */
  interface UpdateInfo {
    info: string;
  }

  /**
   * 所有/lesson 下的response都使用该类型表示一个课程
   */
  type Lesson = Lesson.Entity & {
    Teachers: Member.TeacherEntity[];
    Requests: Request.Entity;
  };

  /**
   * 更新课程信息的body
   * - PUT /lesson/:lid
   */
  type UpdateLesson = Partial<Lesson.Entity>;

  /**
   * 导入课程的body
   * - POST /lesson/import
   */
  type ImportLesson = (Lesson.Entity & { Teachers: number[] })[];

  /**
   * 所有/request 接口response的申请个体类型
   * 
   * 其中info字段是字符串，需要前端再次进行JSON.parse才能得到申请表对象
   */
  type Request = Request.Entity;
}
