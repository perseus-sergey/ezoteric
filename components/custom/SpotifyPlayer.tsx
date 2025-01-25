const SpotifyPlayer = ({ trackId }: { trackId: string }) => {
  return (
    <div className="w-full mx-auto">
      <iframe
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default SpotifyPlayer;
