import { Request } from "express"
export interface AuthInfoRequest extends Request {
  user?: {
    email?:string
  }
}