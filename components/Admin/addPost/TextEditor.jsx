'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: size }).run();
        },
    };
  },
});

export default function TextEditor({ onChange }) {
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    FontSize,
  ],
  content: '<p>Hello world!</p>',
  editorProps: {
    attributes: {
      class: 'min-h-[200px] border p-4 rounded focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    onChange?.(editor.getHTML());
  },
  immediatelyRender: false,
})

  if (!editor) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'font-bold bg-gray-200 px-2' : 'px-2'}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'italic bg-gray-200 px-2' : 'px-2'}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'underline bg-gray-200 px-2' : 'px-2'}
        >
          U
        </button>

        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          defaultValue=""
          className="border px-2"
        >
          <option value="">Font Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
        </select>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200 px-2' : 'px-2'}
        >
          • List
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}



















// 'use client';

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextStyle from '@tiptap/extension-text-style';
// import { Extension } from '@tiptap/core';

// const FontSize = Extension.create({
//   name: 'fontSize',

//   addOptions() {
//     return {
//       types: ['textStyle'],
//     };
//   },

//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           fontSize: {
//             default: null,
//             parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ''),
//             renderHTML: (attributes) => {
//               if (!attributes.fontSize) return {};
//               return {
//                 style: `font-size: ${attributes.fontSize}`,
//               };
//             },
//           },
//         },
//       },
//     ];
//   },

//   addCommands() {
//     return {
//       setFontSize:
//         (size) =>
//         ({ chain }) => {
//           return chain().setMark('textStyle', { fontSize: size }).run();
//         },
//     };
//   },
// });


// export default function TextEditor({ onChange }) {
//   const editor = useEditor({
//   extensions: [
//     StarterKit,
//     Underline,
//     TextStyle,
//     FontSize
//   ],
//     content: '<p>Hello world!</p>',
//     immediatelyRender: false,
//     editorProps: {
//       attributes: {
//         class: 'min-h-[200px] border p-4 rounded focus:outline-none',
//       },
//     },
//     onUpdate({ editor }) {
//       onChange(editor.getHTML()); // Call parent on every update
//     },
//   });

//   if (!editor) return null;

//   return (
//     <div>
//       {/* Toolbar */}
//       <div className="flex items-center gap-2 mb-2">
//         <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
//                 className={editor.isActive('bold') ? 'font-bold bg-gray-200 px-2' : 'px-2'}>
//           B
//         </button>
//         <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
//                 className={editor.isActive('italic') ? 'italic bg-gray-200 px-2' : 'px-2'}>
//           <i>I</i>
//         </button>
//         <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
//                 className={editor.isActive('underline') ? 'underline bg-gray-200 px-2' : 'px-2'}>
//           U
//         </button>
//         <select
//         onChange={(e) =>
//             editor.chain().focus().setFontSize(e.target.value).run()
//         }
//         defaultValue=""
//         className="border px-2"
//         >
//           <option value="">Font Size</option>
//           <option value="12px">12</option>
//           <option value="14px">14</option>
//           <option value="16px">16</option>
//           <option value="20px">20</option>
//           <option value="24px">24</option>
//         </select>

//         {/* ✅ Bullet List Button */}
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={
//             editor.isActive('bulletList')
//               ? 'bg-gray-200 px-2'
//               : 'px-2'
//           }
//         >
//           • List
//         </button>
//       </div>

//       {/* Editor Content */}
//       <EditorContent editor={editor} />
//     </div>
//   );
// }










// 'use client';

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import { useEffect, useState } from 'react';

// export default function TextEditor() {
//   const [output, setOutput] = useState('');

//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: '<p>Hello World!</p>',
//     immediatelyRender: false, 
//     onUpdate({ editor }) {
//       setOutput(editor.getHTML());
//     },
//   });

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">TipTap Editor</h2>
//       <div className="border p-2 rounded mb-4">
//         <EditorContent editor={editor} />
//       </div>

//       <h3 className="font-medium mb-1">Output HTML:</h3>
//       <div className="p-2 border bg-gray-100 rounded">
//         <pre className="text-sm whitespace-pre-wrap">{output}</pre>
//       </div>
//     </div>
//   );
// }
