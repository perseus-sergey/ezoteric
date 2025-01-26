const SpotifyPlayer = ({ trackId }: { trackId?: string | null }) => {
  return (
    trackId && (
      <iframe
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        sandbox="allow-scripts allow-same-origin"
        allowFullScreen
        loading="lazy"
      />
    )
  );
};

export default SpotifyPlayer;
