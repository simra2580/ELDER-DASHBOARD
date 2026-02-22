import { useEffect } from "react";

type EmergencyModalProps = {
  title: string;
  description: string;
  onClose: () => void;
};

export default function EmergencyModal({
  title,
  description,
  onClose,
}: EmergencyModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="emergency-overlay">
      <div className="emergency-box">
        <h1>🚨 EMERGENCY ALERT</h1>
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}