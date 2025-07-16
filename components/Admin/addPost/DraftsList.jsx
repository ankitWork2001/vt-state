"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Trash2, FileEdit } from "lucide-react"

export default function DraftsList({ drafts, onLoadDraft, onDeleteDraft }) {
  if (!drafts || drafts.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Saved Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No drafts saved yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Saved Drafts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <ul className="space-y-4">
            {drafts.map((draft) => (
              <li key={draft.id} className="flex items-center justify-between gap-4 p-2 border rounded-md bg-gray-50">
                <div>
                  <h3 className="font-semibold text-lg">{draft.title || "Untitled Draft"}</h3>
                  <p className="text-sm text-gray-500">
                    Saved: {format(new Date(draft.savedAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onLoadDraft(draft.id)}
                    title="Load Draft"
                  >
                    <FileEdit size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteDraft(draft.id)}
                    title="Delete Draft"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
