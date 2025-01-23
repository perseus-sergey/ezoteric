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
        content_style: `
          .section-image__wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 2.5rem;
            padding: 0 1rem;
          }
          @media (min-width: 1024px) {
            .section-image__wrapper {
              flex-wrap: nowrap;
            }
          }
          body {
            max-width: 64rem;
            min-height: 100dvh;
            flex: 1;
            margin-left: auto;
            margin-right: auto;
            padding-bottom: 1rem;
            padding-left: 4rem;
            padding-right: 4rem;
            display: flex;
            flex-direction: column;
            position: relative;
            padding-top: 2rem;
          }

          @media (max-width: 640px) {
            body {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
          p {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          h2,
          h3,
          h4,
          h5,
          h6 {
            text-align: center;
            font-size: 1.25rem;
            font-weight: 600;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }

          ul {
            list-style-type: disc;
            padding-left: 1.5rem;
          }

          ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
          }

          li {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }

          a {
            color: #2563eb;
            text-decoration: underline;
          }

          a:hover {
            color: #1e40af;
          }

          img {
            max-width: 100%;
            height: auto;
            border-radius: 0.375rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          table {
            table-layout: auto;
            border-collapse: collapse;
            border: 1px solid #d1d5db;
            width: 100%;
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          th,
          td {
            border: 1px solid #d1d5db;
            padding: 0.5rem 1rem;
            text-align: left;
          }

          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }

          blockquote {
            border-left: 4px solid #9ca3af;
            padding-left: 1rem;
            font-style: italic;
            color: #4b5563;
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          code {
            background-color: #e5e7eb;
            padding: 0.125rem 0.25rem;
            border-radius: 0.375rem;
            font-family: monospace;
            font-size: 0.875rem;
          }
          `,
      }}
    />
  );
};
