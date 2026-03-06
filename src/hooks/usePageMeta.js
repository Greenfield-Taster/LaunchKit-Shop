import { useEffect } from "react";
import { SITE_NAME, BASE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from "../utils/seoData";

function setMetaTag(property, content, attribute = "property") {
  let el = document.querySelector(`meta[${attribute}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

const usePageMeta = ({
  title,
  description,
  path,
  noindex = false,
  ogImage,
  ogType = "website",
  jsonLd,
} = {}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonicalUrl = path ? `${BASE_URL}${path}` : BASE_URL;
    const image = ogImage || DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    setMetaTag("description", desc, "name");
    setMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow", "name");

    setMetaTag("og:title", fullTitle);
    setMetaTag("og:description", desc);
    setMetaTag("og:url", canonicalUrl);
    setMetaTag("og:image", image);
    setMetaTag("og:type", ogType);
    setMetaTag("og:locale", "uk_UA");
    setMetaTag("og:site_name", SITE_NAME);

    setMetaTag("twitter:card", "summary_large_image", "name");
    setMetaTag("twitter:title", fullTitle, "name");
    setMetaTag("twitter:description", desc, "name");
    setMetaTag("twitter:image", image, "name");

    setCanonical(canonicalUrl);

    const scriptElements = [];
    if (jsonLd && jsonLd.length > 0) {
      jsonLd.forEach((data) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        scriptElements.push(script);
      });
    }

    return () => {
      document.title = SITE_NAME;
      scriptElements.forEach((el) => el.remove());
    };
  }, [title, description, path, noindex, ogImage, ogType, jsonLd]);
};

export default usePageMeta;
