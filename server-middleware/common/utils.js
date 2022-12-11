/* eslint-disable no-console */
import path from 'path'
import jwt from 'jsonwebtoken'
import * as constant from './constant.js'

export const errorWrapper = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch(error) {
    console.error(`Error happened at ${req.url} : ` + error.toString());
    res.status(500).json({
      message: constant.INTERNAL_SERVER_ERROR,
      e: error.toString(),
    })
  }
}

export const pick = (object, keys) => {
  return keys.reduce((result, key) => {
     if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      if (typeof object[key] !== "undefined" || object[key] !== null || object[key] !== "") {
        result[key] = object[key];
      }
     }
     return result;
   }, {});
}

export const signJwt = (user) => {
  return jwt.sign(user, process.env.SECRET_TOKEN)
}

export const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_TOKEN)
  } catch(err) {
    // eslint-disable-next-line no-console
    console.error(`error token: #${err.message}`)
    return null
  }
}

export const authMiddleware = (req, res, next) => {
  let { authorization } = req.headers
  if (!authorization) {
    return res.status(400).send(constant.INVALID_AUTH)
  }

  const splitAuthorization = authorization.split(' ')
  if (splitAuthorization[0].toLowerCase() === constant.BEARER) {
    authorization = splitAuthorization[1]
  }
  const decodedJwt = verifyJwt(authorization)
  if (!decodedJwt) {
    return res.status(400).send(constant.INVALID_AUTH)
  }
  req.user = decodedJwt
  next()
}

export const prismaPagination = (page, limit = 20) => {
  if (!page) {
    return {}
  }
  return {
    skip: (page - 1) * limit,
    take: +limit,
  }
}

export const pathResolve = (filePath) => {
  return path.resolve('server-middleware' + filePath)
}

export const addQuerySekolahByUserAccess = (reqQuery, user) => {
  if (user?.level === 'operator') {
    if (user.scope === 'dinasprov') {
      return { ...reqQuery, tingkat: { in: ['SMA', 'SMK', 'MA', 'MAK'] } }
    } else if (user.scope === 'kemenag') {
      return { ...reqQuery, is_madrasah: true }
    } else if (user.scope === 'pendidikan') {
      return { ...reqQuery, is_madrasah: false }
    }
  }
  return reqQuery
}

export const validateUploadSekolah = (user, sekolahReqDto) => {
  if (user?.level === 'operator') {
    if (user.scope === 'dinasprov') {
      return ['SMA', 'SMK', 'MA', 'MAK'].includes(sekolahReqDto.tingkat)
    } else if (user.scope === 'kemenag') {
      return sekolahReqDto.is_madrasah === true
    } else if (user.scope === 'pendidikan') {
      return sekolahReqDto.is_madrasah === false
    }
  }
  return true
}

export const toStringDateDDMMYY = (inputDate = new Date) => {
  const date = inputDate.getUTCDate()
  const month = inputDate.getMonth() + 1
  const stringMonth = month < 10 ? `0${month}` : String(month)
  const year = inputDate.getFullYear()

  return `${year}-${stringMonth}-${date}`
}

export const reduceStringArrayToObjValue = (array, values) => {
  const isSingleValue = !Array.isArray(values)
  return array.reduce((prev, current, index) => {
    if (isSingleValue) {
      return Object.assign(prev, { [current]: values })
    }
    return Object.assign(prev, { [current]: values[index] })
  }, {})
}
