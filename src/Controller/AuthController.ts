import Controller from './Controller'
import { NextFunction, Request, Response } from 'express'
import { VideoRequestParams } from '../Request/VideoParams'
import { LoginUserAction } from '../Action/LoginUserAction';
import { LoginBody } from '../Request/LoginRequest';
const path = require('path');

export default class AuthController extends Controller{

async login(req: Request<unknown, unknown, LoginBody, unknown>, res: Response, next: NextFunction){
 
    try {
        res.json(await new LoginUserAction().execute(req.body))
      } catch (error) {
        
        next(error)
      }

}

async signup(req: Request<unknown, unknown,unknown,VideoRequestParams>, res: Response, next: NextFunction){
    res.json({"status":"ok"})
   
}








register(){

this.router.post('/login',[],this.login.bind(this))
this.router.post('/signup',[],this.signup.bind(this))
return this.router



}




}
