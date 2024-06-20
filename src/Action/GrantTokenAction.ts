import * as jwt from 'jsonwebtoken'
import { randomId } from 'licia'
import { User } from 'rms-lib'
import { UserRepository } from '../../Database/Repository/UserRepository'
import { GrantTokenBody } from '../../Request/GrantTokenRequest'
import { UserAuthCache } from '../../Service/UserAuthCache'
import { ACCESS_TOKEN_EXPIRE_TIME } from '../../Util/Constants'

export class GrantTokenAction {
  cache: UserAuthCache
  constructor() {
    this.cache = new UserAuthCache()
  }

  async execute(data: GrantTokenBody) {
    if (data.password !== process.env.GRANT_TOKEN_PASSWORD) {
      throw new Error(`Incorrect password, Please try again`)
    }

    const user = await UserRepository.findOne({ where: { uid: data.user_uid } })
    if (!user) {
      throw new Error(`Incorrect user uid - ${data.user_uid}, Please try again`)
    }

    return await this.getAccessToken(user.transform())
  }

  async getAccessToken(user: User) {
    const access_token = jwt.sign(user, process.env.APP_KEY!, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    })
    const refresh_token = randomId()

    await this.cache.saveRefreshToken(refresh_token, user.uid)

    return { access_token: `Bearer ${access_token}`, refresh_token }
  }
}
