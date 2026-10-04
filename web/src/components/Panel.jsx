export default function Panel({ title, children, className = "" }) {
  return (
    <section className={`rpg-frame p-4 ${className}`}>
      {title && (
        <h2 className="mb-3 border-b border-gold/30 pb-2 text-center font-display text-sm font-bold tracking-[0.2em] text-gold-light uppercase">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
