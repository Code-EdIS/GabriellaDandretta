// Menu mobile
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Apri il menu" : "Chiudi il menu");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Apri il menu");
      mainNav.classList.remove("is-open");
    });
  });
}

// Animazioni di ingresso al passaggio nella viewport.
// Se il browser non supporta IntersectionObserver, gli elementi restano visibili.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Finestra showreel: per ora è un placeholder pronto a ospitare il video reale.
const showreelButton = document.querySelector("[data-showreel]");
const showreelDialog = document.querySelector(".showreel-dialog");
const closeDialogButton = document.querySelector("[data-close-dialog]");

if (showreelButton && showreelDialog) {
  showreelButton.addEventListener("click", () => {
    if (typeof showreelDialog.showModal === "function") {
      showreelDialog.showModal();
    }
  });

  closeDialogButton?.addEventListener("click", () => showreelDialog.close());

  showreelDialog.addEventListener("click", (event) => {
    // Chiude se si clicca sul fondale, non sul contenuto della finestra.
    if (event.target === showreelDialog) showreelDialog.close();
  });
}

// Aggiorna automaticamente l'anno nel footer.
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// =========================================
// CONTACT FORM — MAILTO + GMAIL
// =========================================

const contactForm = document.querySelector("#contact-form");
const gmailFallback = document.querySelector("#gmail-fallback");
const formStatus = document.querySelector("#form-status");

const contactEmail = "INSERISCI-EMAIL@ESEMPIO.IT";


if (contactForm) {

    // Recupera e organizza i dati del modulo
    function getContactData() {

        const formData = new FormData(contactForm);

        const name = formData.get("name");
        const email = formData.get("email");
        const project = formData.get("project");
        const budget = formData.get("budget") || "Non specificato";
        const message = formData.get("message");

        const subject = `Nuova richiesta: ${project}`;

        const body = `
Ciao Gabriella,

hai ricevuto una nuova richiesta dal tuo portfolio.

NOME: ${name}
EMAIL: ${email}
TIPO DI PROGETTO: ${project}
BUDGET INDICATIVO: ${budget}

MESSAGGIO:
${message}

------------------------------
Inviato tramite il portfolio di Gabriella D'Andretta.
        `.trim();

        return { subject, body };
    }


    // Verifica la validità del modulo
    function validateContactForm() {

        if (!contactForm.reportValidity()) {
            return false;
        }

        return true;
    }


    // =====================================
    // INVIO TRAMITE PROGRAMMA EMAIL
    // =====================================

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        if (!validateContactForm()) return;

        const { subject, body } = getContactData();

        const mailtoUrl =
            `mailto:${contactEmail}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoUrl;

        formStatus.textContent =
            "Il programma email si sta aprendo con la richiesta compilata.";

        formStatus.className = "form-status success";

    });


    // =====================================
    // FALLBACK GMAIL
    // =====================================

    gmailFallback.addEventListener("click", () => {

        if (!validateContactForm()) return;

        const { subject, body } = getContactData();

        const gmailUrl = new URL("https://mail.google.com/mail/");

        gmailUrl.searchParams.set("view", "cm");
        gmailUrl.searchParams.set("fs", "1");
        gmailUrl.searchParams.set("to", contactEmail);
        gmailUrl.searchParams.set("su", subject);
        gmailUrl.searchParams.set("body", body);

        window.open(
            gmailUrl.toString(),
            "_blank",
            "noopener,noreferrer"
        );

        formStatus.textContent =
            "Gmail si sta aprendo con la richiesta compilata.";

        formStatus.className = "form-status success";

    });

}