import "./Skeleton.scss";

const Skeleton = ({ width, height, borderRadius, className = "", style = {} }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius,
      ...style,
    }}
  />
);

export const SkeletonProductCard = () => (
  <div className="skeleton-card">
    <Skeleton className="skeleton-card__image" />
    <div className="skeleton-card__content">
      <Skeleton height={18} width="75%" borderRadius={4} />
      <Skeleton height={14} width="50%" borderRadius={4} />
      <Skeleton height={24} width="40%" borderRadius={4} />
      <div className="skeleton-card__actions">
        <Skeleton height={40} borderRadius={8} />
        <Skeleton height={40} width={40} borderRadius={8} />
      </div>
    </div>
  </div>
);

export const SkeletonProductGrid = ({ count = 8 }) => (
  <div className="skeleton-product-grid">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
);

export const SkeletonCarousel = ({ count = 4 }) => (
  <div className="skeleton-carousel">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
);

export const SkeletonProductDetail = () => (
  <div className="skeleton-product-detail">
    <div className="skeleton-product-detail__gallery">
      <Skeleton className="skeleton-product-detail__main-image" />
      <div className="skeleton-product-detail__thumbs">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="skeleton-product-detail__thumb" />
        ))}
      </div>
    </div>
    <div className="skeleton-product-detail__info">
      <Skeleton height={28} width="80%" borderRadius={4} />
      <Skeleton height={14} width="30%" borderRadius={4} />
      <Skeleton height={16} width="45%" borderRadius={4} />
      <div className="skeleton-product-detail__features">
        <Skeleton height={14} width="60%" borderRadius={4} />
        <Skeleton height={14} width="55%" borderRadius={4} />
        <Skeleton height={14} width="50%" borderRadius={4} />
      </div>
      <Skeleton height={32} width="35%" borderRadius={4} />
      <div className="skeleton-product-detail__sizes">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} height={44} borderRadius={8} />
        ))}
      </div>
      <div className="skeleton-product-detail__actions">
        <Skeleton height={56} borderRadius={8} />
        <Skeleton height={56} borderRadius={8} />
      </div>
    </div>
  </div>
);

export const SkeletonProfile = () => (
  <div className="skeleton-profile">
    <div className="skeleton-profile__header">
      <div>
        <Skeleton height={28} width={200} borderRadius={4} />
        <Skeleton height={14} width={160} borderRadius={4} style={{ marginTop: 8 }} />
      </div>
      <Skeleton height={40} width={120} borderRadius={8} />
    </div>

    <div className="skeleton-profile__user-card">
      <div className="skeleton-profile__user-info">
        <Skeleton width={80} height={80} borderRadius="50%" />
        <div>
          <Skeleton height={20} width={180} borderRadius={4} />
          <Skeleton height={14} width={140} borderRadius={4} style={{ marginTop: 8 }} />
        </div>
      </div>
      <Skeleton height={14} width={120} borderRadius={4} />
    </div>

    <div className="skeleton-profile__form-card">
      <Skeleton height={22} width={180} borderRadius={4} style={{ marginBottom: 20 }} />
      <div className="skeleton-profile__form-grid">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton-profile__field">
            <Skeleton height={14} width={80} borderRadius={4} />
            <Skeleton height={48} borderRadius={8} />
          </div>
        ))}
      </div>
    </div>

    <div className="skeleton-profile__orders-card">
      <Skeleton height={22} width={200} borderRadius={4} style={{ marginBottom: 20 }} />
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="skeleton-profile__order">
          <div className="skeleton-profile__order-header">
            <Skeleton height={18} width={140} borderRadius={4} />
            <Skeleton height={24} width={100} borderRadius={12} />
          </div>
          <div className="skeleton-profile__order-item">
            <Skeleton width={56} height={56} borderRadius={8} />
            <div style={{ flex: 1 }}>
              <Skeleton height={16} width="60%" borderRadius={4} />
              <Skeleton height={14} width="30%" borderRadius={4} style={{ marginTop: 6 }} />
            </div>
            <Skeleton height={18} width={80} borderRadius={4} />
          </div>
          <div className="skeleton-profile__order-footer">
            <Skeleton height={14} width={160} borderRadius={4} />
            <Skeleton height={36} width={100} borderRadius={8} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
