import { useEffect, useState } from "react";
import { saveNote } from "../api.js";
import { tg } from "../telegram.js";

const MAX_LENGTH = 500;

export default function NoteCard({ initialNote, disabled, onSaved }) {
  const [note, setNote] = useState(initialNote ?? "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setNote(initialNote ?? ""), [initialNote]);

  async function handleSave() {
    setSaving(true);
    setStatus("Saving…");
    try {
      const { user } = await saveNote(note);
      onSaved(user);
      setStatus("Saved");
      tg?.HapticFeedback?.notificationOccurred("success");
    } catch (err) {
      setStatus(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-2.5 rounded-xl bg-tg-card p-4">
      <label htmlFor="note" className="font-semibold">Your note</label>
      <textarea
        id="note"
        rows={4}
        maxLength={MAX_LENGTH}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={disabled}
        placeholder="Saved to your profile…"
        className="w-full resize-y rounded-lg bg-tg-bg p-2.5 outline-none focus:ring-2 focus:ring-tg-accent disabled:opacity-50"
      />
      <div className="flex items-center justify-between text-xs text-tg-hint">
        <span>{status}</span>
        <span>{note.length}/{MAX_LENGTH}</span>
      </div>
      <button
        onClick={handleSave}
        disabled={disabled || saving}
        className="rounded-lg bg-tg-accent p-3 font-semibold text-tg-accent-text transition active:scale-[0.98] disabled:opacity-50"
      >
        Save
      </button>
    </section>
  );
}
