import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

const getS3UrlToUploadImageApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/generateIconURL'
);

export interface UploadImageData {
  mimeType: string;
  fileName: string;
}

export interface UploadImageApiPutResponse {
  url: string;
}

export const useUploadImage = (walletAddress?: string) => useMutation({
  mutationFn: async (file: File): Promise<string> => {
    const { url } = await getS3UrlToUploadImageApi.post({
      address: walletAddress,
      mimeType: file.type,
      fileName: file.name,
    })
      .then((response: AxiosResponse<UploadImageApiPutResponse>) => response.data);
    const urlObj = new URL(url);

    await fetch(url, {
      method: 'put',
      body: file,
      headers: {
        'content-type': file.type,
      },
    });

    return `${urlObj.origin}${urlObj.pathname}`;
  },
});
