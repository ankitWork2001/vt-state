"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Link from "@tiptap/extension-link"
import Highlight from "@tiptap/extension-highlight"
import { Extension } from "@tiptap/core"
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaLink } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useCallback, useEffect } from "react"

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: size }).run()
        },
    }
  },
})

export default function TextEditor({ onChange, initialContent = "<p>Hello world!</p>", isInvalid }) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [editorStateKey, setEditorStateKey] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc pl-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-6" } },
      }),
      Underline,
      TextStyle,
      FontSize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `min-h-[200px] border p-4 rounded focus:outline-none prose max-w-none ${isInvalid ? "border-red-500 focus:border-red-500" : ""}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
      setEditorStateKey((prev) => prev + 1)
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setEditorStateKey((prev) => prev + 1)
    }

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor])

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false)
    }
  }, [editor, initialContent])

  const handleLinkButtonClick = useCallback(() => {
    const currentLink = editor?.getAttributes("link").href || ""
    setLinkUrl(currentLink)
    setIsLinkDialogOpen(true)
  }, [editor])

  const applyLink = useCallback(() => {
    if (editor) {
      if (linkUrl) {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run()
      }
      setIsLinkDialogOpen(false)
      setEditorStateKey((prev) => prev + 1)
    }
  }, [editor, linkUrl])

  const removeLink = useCallback(() => {
    if (editor) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      setIsLinkDialogOpen(false)
      setEditorStateKey((prev) => prev + 1)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2 flex-wrap" key={editorStateKey}>
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBold().run()
            setEditorStateKey((prev) => prev + 1)
          }}
          variant="ghost"
          size="icon"
          data-active={editor.isActive("bold") ? "true" : "false"}
          className="data-[active=true]:bg-blue-200 data-[active=true]:text-blue-800"
          title="Bold"
        >
          <FaBold />
        </Button>
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleItalic().run()
            setEditorStateKey((prev) => prev + 1)
          }}
          variant="ghost"
          size="icon"
          data-active={editor.isActive("italic") ? "true" : "false"}
          className="data-[active=true]:bg-blue-200 data-[active=true]:text-blue-800"
          title="Italic"
        >
          <FaItalic />
        </Button>
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleUnderline().run()
            setEditorStateKey((prev) => prev + 1)
          }}
          variant="ghost"
          size="icon"
          data-active={editor.isActive("underline") ? "true" : "false"}
          className="data-[active=true]:bg-blue-200 data-[active=true]:text-blue-800"
          title="Underline"
        >
          <FaUnderline />
        </Button>
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBulletList().run()
            setEditorStateKey((prev) => prev + 1)
          }}
          variant="ghost"
          size="icon"
          data-active={editor.isActive("bulletList") ? "true" : "false"}
          className="data-[active=true]:bg-blue-200 data-[active=true]:text-blue-800"
          title="Bullet List"
        >
          <FaListUl />
        </Button>
        <Button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run()
            setEditorStateKey((prev) => prev + 1)
          }}
          variant="ghost"
          size="icon"
          data-active={editor.isActive("orderedList") ? "true" : "false"}
          className="data-[active=true]:bg-blue-200 data-[active=true]:text-blue-800"
          title="Numbered List"
        >
          <FaListOl />
        </Button>
        <Button
          type="button"
          onClick={handleLinkButtonClick}
          variant="ghost"
          size="icon"
          data-active={editor.isActive("link") ? "true" : "false"}
          className="data-[active=true]:bg-blue-200 data-[active=true]:text-blue-800"
          title="Link"
        >
          <FaLink />
        </Button>
        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          defaultValue=""
          className="border px-2 py-1 rounded text-sm h-9"
          title="Font Size"
        >
          <option value="">Font Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
        <select
          onChange={(e) => {
            if (e.target.value === "") {
              editor.chain().focus().unsetHighlight().run()
            } else {
              editor.chain().focus().setHighlight({ color: e.target.value }).run()
            }
          }}
          defaultValue=""
          className="border px-2 py-1 rounded text-sm h-9"
          title="Highlight Color"
        >
          <option value="">Highlight Color</option>
          <option value="#ffeb3b">Yellow</option>
          <option value="#b2ebf2">Cyan</option>
          <option value="#c8e6c9">Green</option>
          <option value="#ffcdd2">Red</option>
          <option value="#d1c4e9">Purple</option>
          <option value="">None</option>
        </select>
      </div>
      <EditorContent editor={editor} />

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={removeLink}>
              Remove Link
            </Button>
            <Button type="button" onClick={applyLink}>
              Set Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
