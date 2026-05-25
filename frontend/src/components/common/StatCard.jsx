export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <p className="muted">{title}</p>
      <div className="stat-value">{value}</div>
      <small className="muted">{subtitle}</small>
    </div>
  );
}