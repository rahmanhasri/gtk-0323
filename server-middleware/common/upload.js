import Multer from 'multer'
const storage = Multer.memoryStorage();

export const multipart = Multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const fileExtensions = ['xlsx'];

export const uploadValidation = (req, res, next) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send('File is required')
  }
  const extension = file.originalname.split('.').pop();
  if (!fileExtensions.includes(extension.toLowerCase())) {
    return res.status(400).send('File format salah');
  }

  return next();
};
