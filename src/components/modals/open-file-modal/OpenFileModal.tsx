import { SendHorizonalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface FileModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedFile: File | null;
  handleSendFile: () => void;
}
export const OpenFileModal = ({ isModalOpen, closeModal, selectedFile, handleSendFile }: FileModalProps) => (
  <Dialog open={isModalOpen} onOpenChange={closeModal}>
    <DialogContent className="modal-content rounded-none bg-[#374C53]">
      <DialogTitle>Preview of Selected File</DialogTitle>
      <div className="flex justify-center file-preview">
        {selectedFile && selectedFile.type.startsWith('image') && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected file preview"
            className="file-preview-image w-[320px]"
          />
        )}
        {!selectedFile?.type.startsWith('image') && <p>{selectedFile?.name}</p>}
      </div>
      <div className="flex justify-center file-preview">
        <Input placeholder="Type your message..." />
        <Button
          onClick={handleSendFile}
          className="modal-close-btn ml-1 bg-[#668899] w-10 rounded-full hover:bg-[#4FA3B8]"
        >
          <SendHorizonalIcon />
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
