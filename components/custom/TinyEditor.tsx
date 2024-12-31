'use client';

import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';
import { useRef } from 'react';

interface ITinyEditorProps {
  editorApiKey: string;
  id: string;
  value: string;
  onEditorChange: (content: string) => void;
}

export const TinyEditor = ({
  editorApiKey,
  id,
  value,
  onEditorChange,
}: ITinyEditorProps) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <Editor
      onEditorChange={(content) => onEditorChange(content)}
      id={id}
      apiKey={editorApiKey}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
      init={{
        height: 500,
        // menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'codesample',
          'emoticons',
          'linkchecker',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'code',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'code | visualblocks | undo redo | blocks fontfamily fontsize | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  );
};
