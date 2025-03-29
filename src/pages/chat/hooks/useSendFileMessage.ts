import { ChangeEventHandler, useState } from 'react';
import { toast } from 'react-toastify';

import { useUploadFileMutation } from '@/services/file';

export const useSendFileMessage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUUId, setFileUUId] = useState<string | null>(null);

  const [uploadFile] = useUploadFileMutation();

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> | undefined = (event) => {
    const selectedImage = event.target.files ? event.target.files[0] : null;
    if (selectedImage) {
      setSelectedFile(selectedImage);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;
    toast.warning('Uploading file...');
    closeModal();

    try {
      const { uuid } = await uploadFile(selectedFile).unwrap();

      if (uuid) {
        setFileUUId(uuid);
      }
    } catch (error) {
      toast.error('File upload failed:');
    } finally {
      setSelectedFile(null);
    }
  };

  return { fileUUId, setFileUUId, selectedFile, handleSendFile, handleFileSelect, isModalOpen, closeModal };
};
