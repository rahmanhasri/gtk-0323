/* eslint-disable no-console */
import jwt from 'jsonwebtoken'
import * as constant from './constant.mjs'

export const errorWrapper = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch(error) {
    console.error(`Error happened at ${req.url} : ` + error);
    res.status(500).json({
      message: constant.INTERNAL_SERVER_ERROR,
    })
  }
}

export const pick = (object, keys) => {
  return keys.reduce((result, key) => {
     if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        result[key] = object[key];
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
