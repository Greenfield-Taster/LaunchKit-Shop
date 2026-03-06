import { useRef } from "react";
import { X, FileText, Shield } from "lucide-react";
import { STORE_INFO } from "../../utils/storeInfo";
import useScrollLock from "../../hooks/useScrollLock";
import useFocusTrap from "../../hooks/useFocusTrap";
import "./LegalModal.scss";

const termsContent = (
  <>
    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">1</span>
        Загальні положення
      </h3>
      <div className="legal-modal__text">
        <p>
          Цей документ є офіційною публічною пропозицією (офертою) інтернет-магазину
          «My Shop» (далі — Продавець) щодо укладення договору купівлі-продажу
          товарів дистанційним способом.
        </p>
        <p>
          Оформлення замовлення на сайті означає повну та безумовну згоду Покупця
          з усіма умовами цієї оферти відповідно до ст. 642 Цивільного кодексу
          України.
        </p>
        <p>
          Продавець залишає за собою право вносити зміни до цих Умов без
          попереднього повідомлення. Актуальна версія завжди доступна на сайті.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">2</span>
        Оформлення замовлення
      </h3>
      <div className="legal-modal__text">
        <p>Замовлення можна оформити наступними способами:</p>
        <ul>
          <li>Через кошик на сайті — цілодобово</li>
          <li>За телефоном: {STORE_INFO.phonesFormatted[0]} ({STORE_INFO.schedule})</li>
          <li>Через месенджери (Telegram)</li>
        </ul>
        <p>
          Після оформлення замовлення менеджер зв'яжеться з вами для підтвердження
          протягом робочого дня. Ціни на сайті є актуальними на момент оформлення
          замовлення та можуть змінюватися без попереднього повідомлення.
        </p>
        <p>
          Продавець має право відмовити у виконанні замовлення, якщо товар
          відсутній на складі або виникли обставини, що унеможливлюють виконання.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">3</span>
        Оплата
      </h3>
      <div className="legal-modal__text">
        <p>Доступні способи оплати:</p>
        <ul>
          <li>Оплата при отриманні (готівка або картка)</li>
          <li>Онлайн-оплата банківською карткою (Visa / MasterCard)</li>
          <li>Google Pay / Apple Pay</li>
          <li>Безготівковий розрахунок для юридичних осіб (за рахунком)</li>
        </ul>
        <p>
          При оплаті на пошті може стягуватися комісія перевізника. Рахунок для
          юридичних осіб надсилається на email протягом 1 робочого дня.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">4</span>
        Доставка
      </h3>
      <div className="legal-modal__text">
        <p>Ми здійснюємо доставку по всій території України через:</p>
        <ul>
          <li>Нова Пошта — відділення та поштомати</li>
          <li>Delivery — відділення</li>
          <li>SAT — відділення</li>
          <li>Кур'єрська доставка — в межах м. Київ</li>
          <li>Самовивіз — зі складу за адресою: {STORE_INFO.pickupAddress}</li>
        </ul>
        <p>
          Орієнтовний термін доставки — 1-5 робочих днів залежно від регіону та
          обраної служби доставки. Вартість доставки розраховується за тарифами
          відповідного перевізника. Безкоштовна доставка при замовленні від 8 000 грн
          (Нова Пошта, кур'єр) або від 13 000 грн (інші перевізники).
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">5</span>
        Повернення та обмін
      </h3>
      <div className="legal-modal__text">
        <p>
          Відповідно до Закону України «Про захист прав споживачів», ви маєте
          право повернути або обміняти товар належної якості протягом 14 днів з
          моменту отримання за умови:
        </p>
        <ul>
          <li>Збережено товарний вигляд, споживчі властивості та упаковку</li>
          <li>Наявний документ, що підтверджує покупку</li>
          <li>Товар не був у використанні</li>
        </ul>
        <p>
          Доставка товару при поверненні здійснюється за рахунок Покупця.
          Повернення коштів відбувається протягом 7 робочих днів з моменту
          отримання повернутого товару.
        </p>
        <p>
          У разі виявлення виробничого браку — повернення та обмін за рахунок
          Продавця.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">6</span>
        Гарантія
      </h3>
      <div className="legal-modal__text">
        <p>
          Гарантійний строк на матраци вказується на сторінці кожного товару та
          може становити від 12 до 60 місяців залежно від виробника та моделі.
        </p>
        <p>Гарантія не поширюється на:</p>
        <ul>
          <li>Механічні пошкодження, нанесені після отримання товару</li>
          <li>Пошкодження внаслідок неправильної експлуатації або зберігання</li>
          <li>Природне зношення матеріалів при тривалому використанні</li>
        </ul>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">7</span>
        Відповідальність
      </h3>
      <div className="legal-modal__text">
        <p>
          Продавець не несе відповідальності за шкоду, заподіяну внаслідок
          неправильного використання товару. Продавець не відповідає за затримки
          доставки, спричинені діями третіх осіб (служб доставки) або обставинами
          непереборної сили.
        </p>
        <p>
          Усі спори вирішуються шляхом переговорів. У разі неможливості
          досягнення згоди — у судовому порядку відповідно до чинного
          законодавства України.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">8</span>
        Контактна інформація
      </h3>
      <div className="legal-modal__text">
        <p>Інтернет-магазин «{STORE_INFO.name}»</p>
        <ul>
          <li>Адреса: {STORE_INFO.address}</li>
          <li>Телефон: {STORE_INFO.phonesFormatted[0]}</li>
          <li>Email: {STORE_INFO.email}</li>
          <li>Графік роботи: {STORE_INFO.schedule}</li>
        </ul>
      </div>
    </section>
  </>
);

const privacyContent = (
  <>
    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">1</span>
        Загальні положення
      </h3>
      <div className="legal-modal__text">
        <p>
          Ця Політика конфіденційності визначає порядок збору, зберігання,
          обробки та захисту персональних даних користувачів інтернет-магазину
          «My Shop» відповідно до Закону України «Про захист персональних
          даних».
        </p>
        <p>
          Використовуючи сайт та надаючи свої персональні дані, ви підтверджуєте
          згоду з умовами цієї Політики. Якщо ви не погоджуєтесь з будь-яким
          пунктом — просимо утриматися від використання сайту.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">2</span>
        Дані, що збираються
      </h3>
      <div className="legal-modal__text">
        <p>Ми збираємо наступні персональні дані:</p>
        <ul>
          <li>Ім'я та прізвище</li>
          <li>Номер телефону</li>
          <li>Адреса електронної пошти</li>
          <li>Інформація про замовлення (склад, спосіб доставки, спосіб оплати)</li>
        </ul>
        <p>
          Ми не збираємо та не зберігаємо платіжні дані (номери банківських
          карток, CVV-коди). Оплата обробляється безпосередньо платіжними
          системами.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">3</span>
        Цілі обробки даних
      </h3>
      <div className="legal-modal__text">
        <p>Персональні дані використовуються для:</p>
        <ul>
          <li>Оформлення та виконання замовлень</li>
          <li>Зв'язку з клієнтом щодо замовлення</li>
          <li>Надсилання інформації про статус замовлення</li>
          <li>Покращення якості обслуговування</li>
          <li>Виконання вимог законодавства України</li>
        </ul>
        <p>
          Ми не використовуємо ваші дані для розсилки рекламних матеріалів без
          вашої окремої згоди.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">4</span>
        Захист даних
      </h3>
      <div className="legal-modal__text">
        <p>
          Ми вживаємо всіх необхідних організаційних та технічних заходів для
          захисту персональних даних від несанкціонованого доступу, зміни,
          розкриття чи знищення.
        </p>
        <p>
          Дані передаються через захищене з'єднання (SSL/TLS). Доступ до
          персональних даних мають лише уповноважені працівники, які зобов'язані
          зберігати конфіденційність.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">5</span>
        Передача третім особам
      </h3>
      <div className="legal-modal__text">
        <p>
          Ваші персональні дані можуть бути передані третім особам виключно у
          таких випадках:
        </p>
        <ul>
          <li>
            Службам доставки (Нова Пошта, Delivery, SAT) — для
            здійснення доставки замовлення
          </li>
          <li>Платіжним системам — для обробки оплати</li>
          <li>
            Державним органам — за офіційним запитом відповідно до законодавства
            України
          </li>
        </ul>
        <p>
          Ми не продаємо та не передаємо ваші дані третім особам у комерційних
          цілях.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">6</span>
        Права користувача
      </h3>
      <div className="legal-modal__text">
        <p>Ви маєте право:</p>
        <ul>
          <li>Отримати інформацію про ваші персональні дані, що зберігаються</li>
          <li>Вимагати виправлення неточних або неповних даних</li>
          <li>Вимагати видалення ваших персональних даних</li>
          <li>Відкликати згоду на обробку персональних даних</li>
        </ul>
        <p>
          Для реалізації цих прав зверніться до нас за контактами, зазначеними
          нижче.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">7</span>
        Cookie-файли
      </h3>
      <div className="legal-modal__text">
        <p>
          Сайт використовує cookie-файли для забезпечення коректної роботи,
          збереження налаштувань користувача та аналізу відвідуваності.
        </p>
        <p>
          Ви можете налаштувати свій браузер для блокування cookie-файлів, проте
          це може вплинути на функціональність сайту.
        </p>
      </div>
    </section>

    <section className="legal-modal__section">
      <h3 className="legal-modal__section-title">
        <span className="legal-modal__section-number">8</span>
        Контактна інформація
      </h3>
      <div className="legal-modal__text">
        <p>
          З питань щодо обробки персональних даних звертайтесь:
        </p>
        <ul>
          <li>Email: {STORE_INFO.email}</li>
          <li>Телефон: {STORE_INFO.phonesFormatted[0]}</li>
          <li>Адреса: {STORE_INFO.address}</li>
        </ul>
        <p>
          Ми розглянемо ваше звернення протягом 10 робочих днів.
        </p>
      </div>
    </section>
  </>
);

const MODAL_CONFIG = {
  terms: {
    title: "Умови використання",
    icon: FileText,
    content: termsContent,
  },
  privacy: {
    title: "Політика конфіденційності",
    icon: Shield,
    content: privacyContent,
  },
};

const LegalModal = ({ isOpen, onClose, type = "terms" }) => {
  const containerRef = useRef(null);

  useScrollLock(isOpen);
  useFocusTrap(containerRef, { isActive: isOpen, onClose });

  if (!isOpen) return null;

  const config = MODAL_CONFIG[type] || MODAL_CONFIG.terms;
  const Icon = config.icon;

  return (
    <div className="legal-modal">
      <div className="legal-modal__overlay" onClick={onClose} />
      <div
        className="legal-modal__container"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
      >
        <div className="legal-modal__header">
          <div className="legal-modal__header-left">
            <Icon size={24} />
            <h2 className="legal-modal__title">{config.title}</h2>
          </div>
          <button
            className="legal-modal__close"
            onClick={onClose}
            aria-label="Закрити"
          >
            <X size={24} />
          </button>
        </div>

        <div className="legal-modal__content">
          {config.content}
        </div>

        <div className="legal-modal__footer">
          <button className="legal-modal__button" onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
