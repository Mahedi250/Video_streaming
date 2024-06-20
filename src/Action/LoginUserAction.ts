// import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { randomId } from 'licia'

// import { UserRepository } from '../../Database/Repository/UserRepository'
 import { LoginBody } from '../Request/LoginRequest'
// import { UserAuthCache } from '../../Service/UserAuthCache'
// import { ACCESS_TOKEN_EXPIRE_TIME } from '../../Util/Constants'

export class LoginUserAction {
 // cache: UserAuthCache
  constructor() {
   // this.cache = new UserAuthCache()
  }

  async execute(data: LoginBody) {
    return await this.loginWithCredential(data.phone, data.password)
  }

  async loginWithCredential(phone: string, password: string) {
    const user = {'id':'1','username':"admin","password":"admin"}
    if (!user) {
      throw new Error(`This phone number - ${phone} is not registered`)
    }


    const sanitizedPasswordHash = user.password.replace(/^\$2y(.+)$/i, '$2a$1')
    //if (!(await bcrypt.compare(password, sanitizedPasswordHash))) {
    if (!('admin'== sanitizedPasswordHash)) {
      throw new Error(`Incorrect password, Please try again`)
    }

    return await this.getAccessToken(user)
  }

  async getAccessToken(user:any) {
    const access_token = jwt.sign(user, process.env.APP_KEY!, {
      expiresIn: process.env.JWT_EXPIRE_IN as string,
    })
    const refresh_token = randomId()

   // await this.cache.saveRefreshToken(refresh_token, user.uid)

    return { access_token, refresh_token }
  }
}
