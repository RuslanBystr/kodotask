import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@ckeditor/ckeditor5-core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AdminRoleEnum } from '@/enums';
import { selectAuthenticatedUserSelector } from '@/store';
import CustomUploadAdapterPlugin from '@/ui-kit/inputs/TextEditor/customUploadAdapter';

interface TextEditorProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialData = '', onChange }) => {
  const [editorData, setEditorData] = useState<string>(initialData);
  const admin = useSelector(selectAuthenticatedUserSelector);

  useEffect(() => {
    setEditorData(initialData);
  }, [initialData]);

  const handleEditorChange = (_: unknown, editor: Editor) => {
    const data = editor.getData();
    setEditorData(data);
    onChange?.(data);
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      disabled={admin?.role === AdminRoleEnum.VIEWER}
      config={{
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
          ],
        },
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            '|',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'insertTable',
            '|',
            'imageUpload',
            '|',
            'undo',
            'redo',
          ],
        },
        image: {
          toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
          ],
        },
        extraPlugins: [CustomUploadAdapterPlugin],
      }}
      onChange={handleEditorChange}
    />
  );
};

export default TextEditor;
