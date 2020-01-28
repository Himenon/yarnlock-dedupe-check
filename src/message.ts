import { UsingRelation } from "./factory/types";

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