export interface StudentAgreement {
  [index: string]: any;
  承担工作: {
    抵扣学时: boolean;
    抵扣学时数: string;
  };
  教学助理自评: {
    自评: string;
  };
}
