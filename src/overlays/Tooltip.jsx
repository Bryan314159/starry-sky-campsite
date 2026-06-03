export default function Tooltip({ hoverInfo }) {
  if (!hoverInfo?.visible || !hoverInfo?.bookmark) return null;

  const { bookmark } = hoverInfo;

  const domain = (() => {
    try {
      return new URL(bookmark.url || '').hostname.replace(/^www\./, '');
    } catch {
      return bookmark.url || '';
    }
  })();

  return (
    <div
      style={{
        position: 'fixed',
        top: '36%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        padding: '12px 16px',
        borderRadius: 14,
        background: 'rgba(10, 14, 42, 0.82)',
        border: '1px solid rgba(255, 238, 170, 0.28)',
        color: '#fff4c8',
        fontFamily: '"STKaiti", "KaiTi", "FZKai-Z03S", serif',
        fontSize: 14,
        backdropFilter: 'blur(8px)',
        pointerEvents: 'none',
        textAlign: 'center',
        minWidth: 120,
        transition: 'opacity 200ms ease',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
        {bookmark.title}
      </div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{domain}</div>
    </div>
  );
}
