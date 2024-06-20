import { log } from 'rms-lib'
import Controller from './Controller'
import { NextFunction, Request, Response } from 'express'
import { TicketSaveRequestBody, TicketSaveValidator } from '../Request/SaveRequestBody'
import { TicketUpdateRequestBody, TicketUpdateValidator } from '../Request/UpdateRequestBody'
import { TicketDeleteRequestParams, TicketDeleteValidator } from '../Request/DeleteRequestParams'
import { TicketSearchRequestParms, TicketSearchValidator } from '../Request/SearchRequestParams'
import { TicketLogSearchParams, TicketLogSearchValidator } from '../Request/TicketLogSearchParams'
import { saveTicket } from '../Action/SaveTicket'
import { updateTicket } from '../Action/UpdateTicket'
import { deleteTicket } from '../Action/DeleteTicket'
import { listTicket } from '../Action/ListTicket'
import { ticketLogList } from '../Action/TicketLogList'
import { deleteTicketLog } from '../Action/DeleteTicketLog'
import { countTicket } from '../Action/CountTicket'
import { SitewiseTicketCountValidator, TicketSitewiseCountRequestParams } from '../Request/SitewiseTicketRequestParams'
import { sitewiseTicketCount } from '../Action/SitewiseTicketCount'
import { TicketCountRequestParams, TicketCountValidator } from '../Request/CountTicketParams'


export default class ApiController extends Controller {
  async receive(req: Request<unknown, unknown, TicketSaveRequestBody, unknown>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket save api -> ', req.body)
      const response = await saveTicket(req.body)
      log('rms ticket save api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async update(req: Request<unknown, unknown, TicketUpdateRequestBody, unknown>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket update api -> ', req.body)
      const response = await updateTicket(req.body)
      //log('rms ticket update api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async delete(req: Request<unknown, unknown, unknown, TicketDeleteRequestParams>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket delete api -> ', req.query)
      const response = await deleteTicket(req.query)
      log('rms ticket delte api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async list(req: Request<unknown, unknown, unknown, TicketSearchRequestParms>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket list api -> ', req.query)
      const response = await listTicket(req.query)
      log('rms ticket list api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async log(req: Request<unknown, unknown, unknown, TicketLogSearchParams>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket log api -> ', req.query)
      const response = await ticketLogList(req.query)
      log('rms ticket log api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async logDelete(req: Request<unknown, unknown, unknown, TicketDeleteRequestParams>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket log delete api -> ', req.query)
      const response = await deleteTicketLog(req.query)
      log('rms ticket log delete api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async sitewiseCount(req: Request<unknown, unknown, unknown, TicketSitewiseCountRequestParams>, res: Response, next: NextFunction) {
    try {
      log('received rms sitewise ticket count api -> ', req.query)
      const response = await sitewiseTicketCount(req.query)
      log('rms sitewise ticket count api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  async count(req: Request<unknown, unknown, unknown, TicketCountRequestParams>, res: Response, next: NextFunction) {
    try {
      log('received rms ticket count api -> ', req.query)
      const response = await countTicket(req.query)
      // log('rms ticket count api sent response -> ', response)
      res.json(response)
    } catch (error) {
      log(error)
      next(error)
    }
  }

  register() {
    this.router.get('/ticket-count',[TicketCountValidator], this.count.bind(this)),
    this.router.get('/ticket-list', [TicketSearchValidator], this.list.bind(this)),
    this.router.get('/ticket-log',[TicketLogSearchValidator], this.log.bind(this)),
    this.router.post('/ticket-create', [TicketSaveValidator], this.receive.bind(this)),
    this.router.post('/ticket-update', [TicketUpdateValidator], this.update.bind(this)),
    this.router.get('/ticket-delete', [TicketDeleteValidator], this.delete.bind(this)),
    this.router.get('/delete-ticket-log',[TicketDeleteValidator], this.logDelete.bind(this)),
    this.router.get('/ticket-sitewise-count', [SitewiseTicketCountValidator], this.sitewiseCount.bind(this))
    return this.router
  }
}
