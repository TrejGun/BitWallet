import {compare, applyPatch} from "fast-json-patch";
import {clone} from "lodash";

/**
  converts non-initial history entries into diffs
  @param longHistory {array}
  @returns {array}
*/
export function migrateFromSnapshotsToDiffs (longHistory) {
  return (
    longHistory
    // convert non-initial history entries into diffs
    .map((entry, index) => {
      if (index === 0) return entry;
      return generateHistoryEntry(longHistory[index - 1], entry);
    })
  );
}

/**
  Generates an array of history objects sense the previous state.
  The object has the keys
    op (the operation performed),
    path (the key and if a nested object then each key will be seperated with a `/`)
    value
  with the first entry having the note and a timestamp when the change took place
  @param previousState {object} - the previous state of the object
  @param newState {object} - the update object
  @param note {string} - a optional note for the state change
  @returns {array}
*/
export function generateHistoryEntry (previousState, newState, note) {
  const entry = compare(previousState, newState);
  // Add a note to the first op, since it breaks if we append it to the entry
  if (entry[0]) {
    if (note) entry[0].note = note;

    entry[0].timestamp = Date.now();
  }
  return entry;
}

/**
  Recovers previous txMeta state obj
  @returns {object}
*/
export function replayHistory (_shortHistory) {
  const shortHistory = clone(_shortHistory);
  return shortHistory.reduce((val, entry) => applyPatch(val, entry).newDocument);
}

/**
  @param txMeta {Object}
  @returns {object} a clone object of the txMeta with out history
*/
export function snapshotFromTxMeta (txMeta) {
  // create txMeta snapshot for history
  const snapshot = clone(txMeta);
  // dont include previous history in this snapshot
  delete snapshot.history;
  return snapshot;
}
