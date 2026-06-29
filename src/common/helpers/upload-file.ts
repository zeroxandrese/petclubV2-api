const uploadFileValidation = (
  file: Express.Multer.File,
  extAllowed = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'],
): string | false => {
  if (!file || !file.originalname) return false;

  const fileNameParts = file.originalname.split('.');
  const extFile = fileNameParts[fileNameParts.length - 1].toLowerCase();

  if (!extAllowed.includes(extFile)) {
    return false;
  }

  return extFile;
};

export default uploadFileValidation;