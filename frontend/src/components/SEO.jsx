import { useEffect } from "react";

const SEO = ({ title, description }) => {
  useEffect(() => {
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    } else {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      descriptionTag.content = description;
      document.head.appendChild(descriptionTag);
    }
  }, [title, description]);

  return null;
};

export default SEO;
