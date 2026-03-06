import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import usePageMeta from "../hooks/usePageMeta";
import { SEO } from "../utils/seoData";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/_profile.scss";

const MOCK_ORDERS = [
  {
    id: "ORD-2026-001",
    date: "2026-03-01",
    total: 4500,
    status: "delivered",
    items: [
      { id: 1, name: "Товар А", quantity: 2, price: 1500, total: 3000 },
      { id: 2, name: "Товар Б", quantity: 1, price: 1500, total: 1500 },
    ],
    deliveryMethod: "Нова Пошта",
    paymentMethod: "Картка онлайн",
  },
  {
    id: "ORD-2026-002",
    date: "2026-02-20",
    total: 2300,
    status: "shipping",
    items: [
      { id: 3, name: "Товар В", quantity: 1, price: 2300, total: 2300 },
    ],
    deliveryMethod: "Кур'єр",
    paymentMethod: "Оплата при отриманні",
  },
  {
    id: "ORD-2026-003",
    date: "2026-02-10",
    total: 8700,
    status: "pending",
    items: [
      { id: 4, name: "Товар Г", quantity: 3, price: 2900, total: 8700 },
    ],
    deliveryMethod: "Самовивіз",
    paymentMethod: "Картка онлайн",
  },
  {
    id: "ORD-2026-004",
    date: "2026-01-15",
    total: 1200,
    status: "cancelled",
    items: [
      { id: 5, name: "Товар Д", quantity: 1, price: 1200, total: 1200 },
    ],
    deliveryMethod: "Нова Пошта",
    paymentMethod: "Оплата при отриманні",
  },
];

const Profile = () => {
  usePageMeta(SEO.profile);
  const { user, logout, updateUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaveMessage(null);

    if (!editedUser.name?.trim()) {
      setSaveMessage({ type: "error", text: "Введіть ім'я" });
      return;
    }
    if (editedUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      setSaveMessage({ type: "error", text: "Невірний формат email" });
      return;
    }

    setIsSaving(true);

    const result = await updateUser(editedUser);

    if (result.success) {
      setIsEditing(false);
      setSaveMessage({ type: "success", text: "Дані успішно збережено" });
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      setSaveMessage({ type: "error", text: result.error || "Не вдалося зберегти дані" });
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: "Очікує обробки", icon: Clock, color: "warning" },
      confirmed: { label: "Підтверджено", icon: CheckCircle, color: "info" },
      processing: { label: "Обробляється", icon: Clock, color: "warning" },
      shipping: { label: "В дорозі", icon: Truck, color: "info" },
      delivered: { label: "Доставлено", icon: CheckCircle, color: "success" },
      cancelled: { label: "Скасовано", icon: XCircle, color: "error" },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Нещодавно";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-not-auth">
            <User size={64} />
            <h2 className="profile-not-auth__title">
              Увійдіть щоб переглянути профіль
            </h2>
            <p className="profile-not-auth__text">
              Авторизуйтесь, щоб отримати доступ до вашого профілю та історії замовлень
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              На головну
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-header__content">
            <h1 className="profile-header__title">Мій профіль</h1>
            <p className="profile-header__subtitle">
              Керуйте своїми персональними даними та налаштуваннями
            </p>
          </div>

          <button
            className="btn btn-outline btn-icon"
            onClick={handleLogout}
            title="Вийти з акаунту"
          >
            <LogOut size={20} />
            <span>Вийти</span>
          </button>
        </div>

        <div className="profile-user-info">
          <div className="profile-user-info__left">
            <div className="profile-user-info__avatar">
              <User size={48} />
            </div>
            <div className="profile-user-info__details">
              <h2 className="profile-user-info__name">
                {user?.name || "Користувач"}
              </h2>
              <p className="profile-user-info__email">
                {user?.email || user?.phone || ""}
              </p>
            </div>
          </div>
          <div className="profile-user-info__right">
            <Calendar size={18} />
            <span className="profile-user-info__date">
              Дата реєстрації: {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card profile-details">
            <div className="profile-card__header">
              <h3 className="profile-card__title">Персональні дані</h3>

              {!isEditing ? (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                  <span>Редагувати</span>
                </button>
              ) : (
                <div className="profile-card__actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X size={16} />
                    <span>Скасувати</span>
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save size={16} />
                    <span>{isSaving ? "Збереження..." : "Зберегти"}</span>
                  </button>
                </div>
              )}
            </div>

            {saveMessage && (
              <div className={`profile-save-message profile-save-message--${saveMessage.type}`}>
                {saveMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{saveMessage.text}</span>
              </div>
            )}

            <div className="profile-form">
              <div className="profile-form__group">
                <label className="profile-form__label">
                  <User size={18} />
                  <span>Ім'я</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    className="profile-form__input"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    placeholder="Введіть ваше ім'я"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.name || "Не вказано"}
                  </p>
                )}
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  <Mail size={18} />
                  <span>Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    className="profile-form__input"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.email || "Не вказано"}
                  </p>
                )}
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  <Phone size={18} />
                  <span>Телефон</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    className="profile-form__input"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    placeholder="0XX XXX XX XX"
                  />
                ) : (
                  <p className="profile-form__value profile-form__value--phone">
                    {user?.phone || "Не вказано"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="profile-orders">
          <div className="profile-orders__header">
            <h3 className="profile-orders__title">
              <Package size={24} />
              Історія замовлень
            </h3>
          </div>

          {MOCK_ORDERS.length === 0 ? (
            <div className="profile-orders-empty">
              <Package size={48} />
              <p>У вас поки немає замовлень</p>
            </div>
          ) : (
            <div className="profile-orders-list">
              {MOCK_ORDERS.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={order.id} className="order-card">
                    <div className="order-card__header">
                      <div className="order-card__header-left">
                        <div className="order-card__id">
                          <Package size={20} />
                          <span>Замовлення {order.id}</span>
                        </div>
                        <div className="order-card__date">
                          <Calendar size={16} />
                          <span>{formatDate(order.date)}</span>
                        </div>
                      </div>
                      <div
                        className={`order-card__status order-card__status--${statusConfig.color}`}
                      >
                        <StatusIcon size={18} />
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>

                    <div className="order-card__items">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <div className="order-item__details">
                            <h4 className="order-item__name">{item.name}</h4>
                          </div>
                          <div className="order-item__pricing">
                            <span className="order-item__qty-price">
                              {item.quantity} x{" "}
                              {Number(item.price).toLocaleString("uk-UA")} грн
                            </span>
                            <span className="order-item__total">
                              {Number(item.total).toLocaleString("uk-UA")} грн
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-card__footer">
                      <div className="order-card__info">
                        <div className="order-card__delivery">
                          <Truck size={16} />
                          <span>{order.deliveryMethod}</span>
                        </div>
                        <div className="order-card__total">
                          <CreditCard size={16} />
                          <span className="order-card__total-label">
                            Загальна сума:
                          </span>
                          <span className="order-card__total-value">
                            {Number(order.total).toLocaleString("uk-UA")} грн
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
