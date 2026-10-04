import { useEffect, useState } from "react";
import { saveNote } from "../api.js";
import Panel from "../components/Panel.jsx";
import { tg } from "../telegram.js";

const MAX_LENGTH = 500;

export default function JournalScreen({ user, onSaved }) {
  const [note, setNote] = useState(user?.note ?? "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setNote(user?.note ?? ""), [user?.note]);

  async function handleSave() {
    setSaving(true);
    setStatus("Inscribing…");
    try {
      const { user: updated } = await saveNote(note);
      onSaved(updated);
      setStatus("Saved to your journal");
      tg?.HapticFeedback?.notificationOccurred("success");
    } catch (err) {
      setStatus(`Failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Journal">
      <textarea
        rows={7}
        maxLength={MAX_LENGTH}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={!user}
        placeholder="Write down your tale, traveler…"
        className="w-full resize-none rounded-md border border-gold/30 bg-parchment p-3 text-lg leading-snug text-stone-dark outline-none select-text placeholder:text-stone/50 focus:border-gold disabled:opacity-50"
      />
      <div className="mt-1 mb-3 flex justify-between text-sm text-muted">
        <span>{status}</span>
        <span className="tabular-nums">{note.length}/{MAX_LENGTH}</span>
      </div>
      <button
        onClick={handleSave}
        disabled={!user || saving}
        className="w-full rounded-md border border-gold-light bg-linear-to-b from-gold to-[#8a6424] py-3 font-display font-bold tracking-widest text-night uppercase shadow-lg transition active:translate-y-px disabled:opacity-50"
      >
        Save
      </button>
    </Panel>
  );
}
