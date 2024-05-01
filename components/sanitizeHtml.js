const sanitizeHtml = (htmlString) => {
    return htmlString
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("START_QUOTE", '<div class="quote">')
        .replaceAll("END_QUOTE", "</div>");
};

export { sanitizeHtml };
