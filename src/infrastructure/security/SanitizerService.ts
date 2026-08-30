import DOMPurify from "dompurify";

export class SanitizerService {
  /**
   * Sanitizes dirty HTML / Markdown text from AI output or user input
   * to prevent XSS attacks.
   */
  public static sanitize(dirtyText: string): string {
    if (!dirtyText) return "";
    return DOMPurify.sanitize(dirtyText, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "p",
        "span",
        "code",
        "pre",
        "ul",
        "ol",
        "li",
        "br",
      ],
      ALLOWED_ATTR: ["href", "target", "class", "rel", "id"],
    });
  }

  /**
   * Strips all HTML tags and returns plain text.
   */
  public static sanitizeToPlainText(dirtyText: string): string {
    if (!dirtyText) return "";
    return DOMPurify.sanitize(dirtyText, { ALLOWED_TAGS: [] }).trim();
  }
}
