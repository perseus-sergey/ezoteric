'use client';

import React from 'react';

const SpotifyPlayer = ({ trackId }: { trackId?: string | null }) => {
  return trackId ? (
    <div
      data-service="spotify"
      data-id={trackId}
      style={{ borderRadius: '12px', overflow: 'hidden' }} // Важливо для borderRadius
    >
      {/* Placeholder контент (необов'язково) - можна додати, наприклад, зображення або текст, який буде видно до завантаження iframe */}
      <div data-placeholder>
        <p>Завантаження Spotify плеєра...</p>
      </div>
    </div>
  ) : null;
};

export default SpotifyPlayer;
