import { Injectable } from '@nestjs/common';

@Injectable()
export class UploaderService {
  create(file: Express.Multer.File) {
    return {
      message: 'فایل با موفقیت آپلود شد',
      originalName: file.originalname,
      fileName: file.filename,
      size: file.size,
      mimeType: file.mimetype,
      path: file.path,
    };
  }
}
