import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  createFolder(folderName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      v2.api.create_folder(`Rubik/${folderName}`, (error: any, result: any) => {
        if (error) {
          reject(new Error('Có lỗi xảy ra khi tạo thư mục trên cloudinary'));
        } else {
          resolve(result);
        }
      });
    });
  }

  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) reject(error);
          resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(upload);
      },
    );
  }

  async deleteImage(folderName: string, publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        `Rubik/${folderName}/${publicId}`,
        (error, result) => {
          if (error) {
            reject(new Error('Xoá hình ảnh trên cloudinary thất bại'));
          } else {
            resolve(result);
          }
        },
      );
    });
  }
}
