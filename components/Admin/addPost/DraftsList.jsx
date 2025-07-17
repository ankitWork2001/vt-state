"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Trash2, FileEdit } from "lucide-react"
import { motion } from "framer-motion"

export default function DraftsList({ drafts, onLoadDraft, onDeleteDraft }) {
  if (!drafts || drafts.length === 0) {
    return (
      <Card className="mt-8 border-none shadow-lg bg-white">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800">Saved Drafts</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 font-medium">No drafts saved yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8 border-none shadow-lg bg-white">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-800">Saved Drafts</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3 max-h-80">
          {drafts.map((draft) => (
            <motion.li
              key={draft.id}
              className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 truncate">{draft.title || "Untitled Draft"}</h3>
                <p className="text-sm text-gray-500">Saved: {format(new Date(draft.savedAt), "MMM dd, yyyy HH:mm")}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-gray-600 hover:bg-[#1F3C5F] hover:text-white border-gray-300 transition-colors duration-200 bg-transparent"
                  size="icon"
                  onClick={() => onLoadDraft(draft.id)}
                  title="Load Draft"
                >
                  <FileEdit size={18} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 hover:bg-red-600 hover:text-white border-gray-300 transition-colors duration-200 bg-transparent"
                  size="icon"
                  onClick={() => onDeleteDraft(draft.id)}
                  title="Delete Draft"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
