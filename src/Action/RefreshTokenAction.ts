import * as jwt from 'jsonwebtoken'
import { UserRepository } from '../../Database/Repository/UserRepository'
import { RefreshTokenBody } from '../../Request/RefreshTokenRequest'
import { UserAuthCache } from '../../Service/UserAuthCache'
import { ACCESS_TOKEN_EXPIRE_TIME } from '../../Util/Constants'

export class RefreshTokenAction {
  cache: UserAuthCache

  constructor() {
    this.cache = new UserAuthCache()
  }

  async execute(data: RefreshTokenBody) {
    const userUid = await this.cache.getUserUid(data.refresh_token)
    if (!userUid) {
      throw new Error('Refresh token not found, Please login again')
    }

    const user = await UserRepository.findOne({ where: { uid: userUid } })
    if (!user) {
      throw new Error(`User not found with uid: ${userUid}`)
    }

    if (user.status === 'inactive' || user.status === 'blocked') {
      throw new Error(`User not permitted to login ${userUid}`)
    }

    const access_token = jwt.sign(user.transform(), process.env.APP_KEY!, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    })

    return { access_token }
  }
}
