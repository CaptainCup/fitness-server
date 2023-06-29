import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `${name}-${Date.now()}${fileExtName}`);
};

@Controller('files')
export class FilesController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    return `api/files/${file.filename}`;
  }

  @Get('/:file')
  async getFile(@Param('file') file: any, @Res() res: any) {
    return res.sendFile(file, { root: `uploads/` }, (err: any) => {
      if (err) {
        res.status(err?.status || 404).end();
      }
    });
  }
}
