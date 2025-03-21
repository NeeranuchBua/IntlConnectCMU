import { AccountType } from "@/types/CMUOAuth/AccountType";
import { Profile } from "next-auth";

export type CmuOAuthBasicInfo = {
  cmuitaccount_name: string;
  cmuitaccount: string;
  student_id?: string;
  prename_id?: string;
  prename_TH?: string;
  prename_EN?: string;
  firstname_TH: string;
  firstname_EN: string;
  lastname_TH: string;
  lastname_EN: string;
  organization_code: string;
  organization_name_TH: string;
  organization_name_EN: string;
  itaccounttype_id: AccountType;
  itaccounttype_TH: string;
  itaccounttype_EN: string;
};

export interface CMUOAuthProfile extends Profile {
  cmuitaccount: string;
  firstname_EN: string;
  lastname_EN: string;
  student_id?: string;
}