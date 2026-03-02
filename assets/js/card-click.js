(function () {
  var CARD_SELECTOR = "[data-clickable-card]";
  var PRIMARY_LINK_SELECTOR = "[data-card-primary][href], a[href]";
  var INTERACTIVE_SELECTOR = "a, button, input, select, textarea, label, summary";

  function findCard(node) {
    if (!node || !node.closest) return null;
    return node.closest(CARD_SELECTOR);
  }

  function findPrimaryLink(card) {
    if (!card) return null;
    return card.querySelector(PRIMARY_LINK_SELECTOR);
  }

  function hasTextSelection() {
    if (!window.getSelection) return false;
    var selection = window.getSelection();
    if (!selection || selection.isCollapsed) return false;
    return selection.toString().trim().length > 0;
  }

  function isInsideInteractiveElement(target, card) {
    if (!target || !target.closest) return false;
    var interactiveNode = target.closest(INTERACTIVE_SELECTOR);
    return !!interactiveNode && card.contains(interactiveNode);
  }

  function navigate(link, openInNewTab) {
    if (!link || !link.href) return;
    if (openInNewTab) {
      var openedWindow = window.open(link.href, "_blank", "noopener");
      if (!openedWindow) window.location.assign(link.href);
      return;
    }
    window.location.assign(link.href);
  }

  function enhanceKeyboardAccessibility() {
    var cards = document.querySelectorAll(CARD_SELECTOR);
    cards.forEach(function (card) {
      if (card.matches("a")) return;
      if (!card.hasAttribute("tabindex")) {
        card.setAttribute("tabindex", "0");
      }
      if (!card.hasAttribute("role")) {
        card.setAttribute("role", "link");
      }
    });
  }

  function handleClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;

    var card = findCard(event.target);
    if (!card) return;
    if (isInsideInteractiveElement(event.target, card)) return;
    if (hasTextSelection()) return;

    var primaryLink = findPrimaryLink(card);
    if (!primaryLink) return;

    event.preventDefault();
    navigate(primaryLink, event.ctrlKey || event.metaKey);
  }

  function handleKeydown(event) {
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    var card = findCard(event.target);
    if (!card || event.target !== card) return;

    var primaryLink = findPrimaryLink(card);
    if (!primaryLink) return;

    event.preventDefault();
    navigate(primaryLink, event.ctrlKey || event.metaKey);
  }

  document.addEventListener("DOMContentLoaded", function () {
    enhanceKeyboardAccessibility();
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
  });
})();
