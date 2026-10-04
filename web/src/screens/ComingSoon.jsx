import Panel from "../components/Panel.jsx";

export default function ComingSoon({ item }) {
  return (
    <Panel title={item.label}>
      <div className="py-6 text-center">
        <div className="mb-3 text-5xl">{item.icon}</div>
        <p className="font-display text-gold-light">Sealed by ancient magic</p>
        <p className="text-muted">This part of the realm opens soon.</p>
      </div>
    </Panel>
  );
}
