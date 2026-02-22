type Props = {
  alert: any;
  onEscalate: (id: number) => void;
  onDismiss: (id: number) => void;
};

function AlertCard({ alert, onEscalate, onDismiss }: Props) {
  return (
    <div className={`alert-card ${alert.priority.toLowerCase()}`}>
      <h3>{alert.title}</h3>
      <p>{alert.description}</p>
      <p><strong>Location:</strong> {alert.location}</p>
      <p><strong>Time:</strong> {alert.timestamp}</p>

      <span className={`status ${alert.status.toLowerCase()}`}>
        {alert.status}
      </span>

      {alert.status === "Pending" && (
        <div style={{ marginTop: "15px" }}>
          <button
            style={{ background: "#e74c3c", color: "white" }}
            onClick={() => onEscalate(alert.id)}
          >
            Escalate
          </button>
          <button
            style={{ background: "#27ae60", color: "white" }}
            onClick={() => onDismiss(alert.id)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default AlertCard;