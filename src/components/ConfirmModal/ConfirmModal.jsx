import { useRef } from "react";
import useScrollLock from "../../hooks/useScrollLock";
import useFocusTrap from "../../hooks/useFocusTrap";
import "./ConfirmModal.scss";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Так", cancelText = "Скасувати" }) => {
  const containerRef = useRef(null);

  useScrollLock(isOpen);
  useFocusTrap(containerRef, { isActive: isOpen, onClose });

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal">
      <div className="confirm-modal__overlay" onClick={onClose} />
      <div
        className="confirm-modal__container"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="confirm-modal__content">
          <h3 className="confirm-modal__title">{title}</h3>
          <p className="confirm-modal__message">{message}</p>

          <div className="confirm-modal__actions">
            <button
              className="confirm-modal__button confirm-modal__button--cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className="confirm-modal__button confirm-modal__button--confirm"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
