(function () {
  "use strict";

  // Year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
      toggle.setAttribute("aria-label", open ? "Abrir menú de navegación" : "Cerrar menú de navegación");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú de navegación");
        menu.hidden = true;
      });
    });
  }

  // Header solid state once hero scrolls out of view
  var header = document.getElementById("siteHeader");
  var hero = document.getElementById("inicio");
  if (header && hero && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          header.classList.toggle("is-solid", !entry.isIntersecting || entry.intersectionRatio < 0.2);
        });
      },
      { threshold: [0, 0.2] }
    );
    io.observe(hero);
  } else if (header) {
    header.classList.add("is-solid");
  }

  // Contact form: AJAX submit via FormSubmit
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("formSubmit");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var action = form.getAttribute("action");
      var ajaxUrl = action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      var data = new FormData(form);

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
      status.hidden = true;
      status.classList.remove("is-success", "is-error");

      fetch(ajaxUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      })
        .then(function (res) {
          if (!res.ok) throw new Error("network");
          return res.json();
        })
        .then(function () {
          status.textContent = "Gracias. Tu mensaje fue enviado, te contactaremos pronto.";
          status.classList.add("is-success");
          status.hidden = false;
          form.reset();
        })
        .catch(function () {
          status.textContent =
            "No se pudo enviar el mensaje. Escríbenos directamente a contacto@acsol.com.mx.";
          status.classList.add("is-error");
          status.hidden = false;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar mensaje";
        });
    });
  }
})();
