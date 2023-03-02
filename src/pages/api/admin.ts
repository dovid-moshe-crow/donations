import { NextApiRequest, NextApiResponse } from "next";
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import { DMMFClass } from '@prisma/client/runtime'

const prisma = new PrismaClient();


AdminJS.registerAdapter({ Database, Resource })

const dmmf = ((prisma as any)._baseDmmf as DMMFClass)

const admin = new AdminJS({
  resources: [{
    resource: { model: dmmf.modelMap.Post, client: prisma },
    options: {},
  }, {
    resource: { model: dmmf.modelMap.Profile, client: prisma },
    options: {},
  }, {
    resource: { model: dmmf.modelMap.User, client: prisma },
    options: {},
  }],
})

const router = AdminJSExpress.buildRouter(admin)




export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return 
}
