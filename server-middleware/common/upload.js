import Multer from 'multer'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers'

const storage = Multer.memoryStorage();

const client = new S3Client({
  region: 'ap-southeast-1',
  credentials: fromEnv(),
});

export const multipart = Multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const fileExtensions = ['xlsx', 'jpg', 'jpeg', 'png'];

export const uploadValidation = (req, res, next) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send('File is required')
  }
  const arrayNames = file.originalname.split('.')
  const extension = arrayNames.pop();
  if (!fileExtensions.includes(extension.toLowerCase())) {
    return res.status(400).send('File format salah');
  }

  file.extension = extension
  file.fileName = arrayNames.join('')
  return next();
};

/**
 *
 * @param {Buffer} file
 * @param {String} folderName
 * @param {String} fileName
 * @returns file location
 */

export const uploadToS3 = async (file, folderName, fileName) => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: 'sampang-bucket',
      Key: `media${folderName}/${fileName}`,
      ACL: 'public-read',
      Body: file,
    });

    await client.send(putObjectCommand);
    // eslint-disable-next-line no-console
    console.log(`process upload done : ${putObjectCommand.input.Key}`);
    return putObjectCommand.input.Key
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`process upload error : ${e.toString()}`);
  }
}

/**
 *
 * @param {String} url
 * @returns fullURL
 */
export const getS3FullUrl = (url) => {
  const awsBucket = 'sampang-bucket'
  const awsRegion = process.env.AWS_REGION

  return `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${url}`;
}
