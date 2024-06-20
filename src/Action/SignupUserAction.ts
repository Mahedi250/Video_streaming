import * as bcrypt from 'bcrypt'
import { random } from 'licia'
import { USER_TYPE, UserModel } from 'rms-lib'
import { SignupBody } from '../../Request/SignupRequest'
import { UserRepository } from '../../Database/Repository/UserRepository'
import { CompanyRepository } from '../../Database/Repository/CompanyRepository'
import { randomUUID } from 'crypto'

export class SignupUserAction {
  constructor(private data: SignupBody) {}
  async execute(userUid: number) {
    const loginUser = await UserRepository.findOne({ where: { uid: userUid } })
    if (!loginUser) throw new Error('user not found for creating user.')

    if (loginUser.type !== 'sudo' && loginUser.type !== 'superuser') {
      throw new Error('not permitted to creating user.')
    }

    const alreadyExists = await UserRepository.exists({ where: { phone: this.data.phone } })
    if (alreadyExists) throw new Error(`Phone number already registered: ${this.data.phone}`)

    const company = await CompanyRepository.findOne({ where: { id: this.data.company_id } })
    if (!company) throw new Error('Company not found')

    const user = new UserModel()

    if (loginUser.type === 'superuser') {
      const allowedType = ['read_only', 'employee']
      if (allowedType.includes(this.data.type)) {
        user.type = this.data.type
      } else {
        throw new Error('"type" not allowed to insert')
      }
    } else {
      user.type = this.data.type
    }

    user.uid = await this.findAvailableUID()
    user.name = this.data.name
    user.phone = this.data.phone
    user.company_id = this.data.company_id
    user.password = await bcrypt.hash(this.data.password, 10)
    user.type = this.data.type
    user.tenants = this.data.tenants
    user.status = 'active'
    user.uuid = randomUUID()

    const result = await UserRepository.save(user)
    return result.transform()
  }

  async findAvailableUID() {
    while (true) {
      const uid = random(10000, 99999)
      const user = await UserRepository.findOne({ where: { uid } })
      if (user === null) return uid
    }
  }
}
