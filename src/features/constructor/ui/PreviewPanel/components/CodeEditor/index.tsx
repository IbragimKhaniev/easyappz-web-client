import React, { useEffect, useMemo, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  useSandpack,
} from '@codesandbox/sandpack-react';
// import '@codesandbox/sandpack-react/dist/index.css';

import { FileSystemItem, useGetApplicationsIdFiles } from '@/api/core';

// Компонент для обработки изменений
const EditorWithFileChanges = () => {
  const { sandpack, listen } = useSandpack();
  const { files, activeFile } = sandpack;

  // Подписываемся на изменения кода
  useEffect(() => {
    const unsubscribe = listen((message) => {
      console.log({
        message,
      });
    });

    return () => unsubscribe(); // Очищаем подписку при размонтировании
  }, [listen, sandpack]);

  return (
    <SandpackCodeEditor
      showLineNumbers
      showTabs
      wrapContent
    />
  );
};

// Основной компонент
interface ICodeEditorProps {
  applicationId: string;
}

export const CodeEditor = ({ applicationId }: ICodeEditorProps) => {
  const { data } = useGetApplicationsIdFiles(applicationId);

  console.log({
    data,
  });

  // Начальные файлы
//   const initialFiles = {
//     '/App.js': {
//       code: `export default function App() {
//   return <h1>Hello, world!</h1>;
// }`,
//       active: true, // Этот файл открыт по умолчанию
//     },
//     '/index.js': {
//       code: `import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));`,
//     },
//     '/index.html': {
//       code: `<!DOCTYPE html>
// <html>
// <head><title>Demo</title></head>
// <body><div id="root"></div></body>
// </html>`,
//     },
//     '/styles.css': {
//       code: `body {
//   font-family: Arial, sans-serif;
//   margin: 0;
//   padding: 20px;
// }`,
//     },
//   };

  const initialFiles = useMemo(() => {
    if (!data?.files) {
      return {};
    }

    const parseData = (files: FileSystemItem[]): Record<string, string> => {
      const responseList: Record<string, string> = {};

      files.forEach((currentFile) => {
        responseList[`/${currentFile.path}`] = 'code';

        if (currentFile.type === 'directory' && currentFile.children) {
          return {
            ...responseList,
            ...parseData(currentFile.children),
          };
        }
      });

      return responseList;
    };

    console.log(
      parseData(data.files),
    );

    return parseData(data.files);
  }, [data]);

  return (
    <SandpackProvider
      template="vanilla"
      files={initialFiles}
      theme="dark"
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <EditorWithFileChanges />
      </SandpackLayout>
    </SandpackProvider>
  );
};
