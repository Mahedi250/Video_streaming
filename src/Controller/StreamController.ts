import Controller from './Controller'
import { NextFunction, Request, Response } from 'express'
import { VideoRequestParams } from '../Request/VideoParams'
const path = require('path');

export default class StreamController extends Controller{

async stream(req: Request<unknown, unknown, unknown, unknown>, res: Response, next: NextFunction){
 
    const filePath = path.join(__dirname,'..','..', 'video', 'video.mpd');
    console.log(filePath);
    res.sendFile(filePath);

}

async ServeDashSegment(req: Request<unknown, unknown,unknown,VideoRequestParams>, res: Response, next: NextFunction){

    console.log("called segment");
    const {segment } = req.params as VideoRequestParams;
    const filePath = path.join(__dirname,'..','..','video', segment);
    res.sendFile(filePath);
}








register(){

this.router.get('/video/video.mpd',[],this.stream.bind(this))
this.router.get('/video/:segment',[],this.ServeDashSegment.bind(this))
return this.router



}




}
