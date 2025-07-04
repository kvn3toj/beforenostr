export const parseContent = (event) => {
  try {
    // Attempt to parse the content as JSON, as is common for many Nostr events
    return JSON.parse(event.content);
  } catch (e) {
    // If parsing fails, return the raw content or null/undefined based on expected behavior
    console.error("Failed to parse event content:", e);
    return event.content; // Or handle as per project requirement
  }
};

export const getEventTag = (event, tagName) => {
  // Find the first tag with the given name
  const tag = event.tags?.find(tag => tag[0] === tagName);
  // Return the second element of the tag array if found, which is typically the value
  return tag ? tag[1] : undefined;
};

// You might want to add more specific type definitions for parsed content based on event kind later
// For example:
/*
interface MundoContent { /* ... */ /* }
interface PlaylistContent { /* ... */ /* }
interface ExperienciaContent { /* ... */ /* }

export const parseContentSpecific = (event) => {
  try {
    const content = JSON.parse(event.content);
    switch (event.kind) {
      case 31002: // Mundo
        return content as MundoContent;
      case 31003: // Playlist
        return content as PlaylistContent;
      case 31004: // Experiencia
        return content as ExperienciaContent;
      default:
        return content;
    }
  } catch (e) {
    console.error("Failed to parse specific event content:", e);
    return event.content;
  }
};
*/ 