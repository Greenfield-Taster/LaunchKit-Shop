import { useState } from "react";
import PropTypes from "prop-types";
import "./FAQ.scss";

const FAQ = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq">
      {items.map((item, index) => (
        <div
          key={index}
          className={`faq__item ${
            openIndex === index ? "faq__item--active" : ""
          }`}
        >
          <button
            className="faq__header"
            onClick={() => toggleAccordion(index)}
            aria-expanded={openIndex === index}
          >
            <span className="faq__question">{item.question}</span>
            <svg
              className="faq__icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className="faq__content"
            style={{
              maxHeight: openIndex === index ? "1000px" : "0",
            }}
          >
            <div className="faq__answer">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

FAQ.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
        .isRequired,
    })
  ).isRequired,
};

export default FAQ;
