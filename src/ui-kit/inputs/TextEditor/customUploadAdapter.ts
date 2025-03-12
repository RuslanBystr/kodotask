import { Editor } from '@ckeditor/ckeditor5-core';
import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';

import { getAccessToken, getEnv } from '@/utils';

const { api } = getEnv();

function uploadAdapter(loader: FileLoader): UploadAdapter {
  return {
    upload: async () =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        try {
          const file = await loader.file;
          const formData = new FormData();
          if (file) {
            formData.append('file', file);
          }

          const token = getAccessToken();
          const response = await fetch(`${api}/file`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          const imageUrl = `${api}/file/${data.uuid}`;
          resolve({ default: imageUrl });
        } catch (error) {
          console.error(error); // eslint-disable-line no-console
          reject(error);
        }
      }),
    abort: () => {},
  };
}

export default function CustomUploadAdapterPlugin(editor: Editor) {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => uploadAdapter(loader);
}
