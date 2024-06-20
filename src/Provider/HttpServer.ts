import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
const cors = require('cors');
import { authenticateJWT } from '../Middleware/authMiddleware';

import StreamController from '../Controller/StreamController'
import AuthController from '../Controller/AuthController';

const app = express()
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(authenticateJWT)
app.use('/api', new AuthController().register())
app.use('/api', new StreamController().register())

export default app
