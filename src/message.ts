import { UsingRelation } from "./factory";

export interface Data {
  name: string;
  data: UsingRelation[];
}

export interface MessageData {
  warning: Data[];
  errors: Data[];
}

export const generateMessage = (data: MessageData): void => { 

}