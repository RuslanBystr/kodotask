import { format } from 'date-fns';

export const processDownloadingFileByUrl = ({ fileName, url }: { url: string; fileName: string }) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${format(Date.now(), 'dd-MMM-yyyy')}_${fileName}`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
