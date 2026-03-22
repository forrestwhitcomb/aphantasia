// ============================================================
// APHANTASIA — Note Attachment Logic
// ============================================================
// Attaches notes to shapes via two mechanisms:
//   1. Explicit: note.linkedShapeId is set
//   2. Proximity: nearest non-note shape within threshold
//
// Notes that don't attach to any shape become global context.
// ============================================================

interface ShapeBounds {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  content?: string;
  linkedShapeId?: string;
}

const PROXIMITY_THRESHOLD = 60; // px edge-to-edge distance

/**
 * Compute edge-to-edge distance between two rectangles.
 * Returns 0 if they overlap.
 */
function edgeDistance(a: ShapeBounds, b: ShapeBounds): number {
  const aRight = a.x + a.width;
  const aBottom = a.y + a.height;
  const bRight = b.x + b.width;
  const bBottom = b.y + b.height;

  const dx = Math.max(0, Math.max(a.x - bRight, b.x - aRight));
  const dy = Math.max(0, Math.max(a.y - bBottom, b.y - aBottom));

  return Math.sqrt(dx * dx + dy * dy);
}

export interface NoteAttachmentResult {
  /** Map of shapeId → array of note texts attached to it */
  attachedNotes: Map<string, string[]>;
  /** Notes that didn't attach to any shape (global context) */
  globalNotes: string[];
}

/**
 * Attach notes to shapes. Returns a map of shapeId → note texts
 * and a list of unattached global notes.
 */
export function attachNotes(shapes: ShapeBounds[]): NoteAttachmentResult {
  const notes = shapes.filter((s) => s.type === "note" || s.type === "sticky");
  const nonNotes = shapes.filter((s) => s.type !== "note" && s.type !== "sticky");

  const attachedNotes = new Map<string, string[]>();
  const globalNotes: string[] = [];

  for (const note of notes) {
    const noteText = (note.label ?? note.content ?? "").trim();
    if (!noteText) continue;

    // 1. Explicit link
    if (note.linkedShapeId) {
      const existing = attachedNotes.get(note.linkedShapeId) ?? [];
      existing.push(noteText);
      attachedNotes.set(note.linkedShapeId, existing);
      continue;
    }

    // 2. Proximity: find nearest non-note shape within threshold
    let nearestId: string | null = null;
    let nearestDist = Infinity;

    for (const shape of nonNotes) {
      const dist = edgeDistance(note, shape);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestId = shape.id;
      }
    }

    if (nearestId && nearestDist <= PROXIMITY_THRESHOLD) {
      const existing = attachedNotes.get(nearestId) ?? [];
      existing.push(noteText);
      attachedNotes.set(nearestId, existing);
    } else {
      // Unattached → global context
      globalNotes.push(noteText);
    }
  }

  return { attachedNotes, globalNotes };
}
