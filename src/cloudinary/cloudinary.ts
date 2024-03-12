import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return v2.config({
      cloud_name: 'dcgntixwq',
      api_key: '797487588186242',
      api_secret: 'VwjUmZxlO1MsaO7ZcRedzT8500g',
      secure: true,
    });
  },
};
