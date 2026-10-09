/*
 * Affiche le contenu du portfolio à partir des fichiers JSON :
 *   data/profil.json  → nom, bio, expertise, contact
 *   data/projets.json → réalisations
 * Ces mêmes fichiers sont lus par l'application mobile et modifiés par l'application admin.
 * Une fois le contenu en place, script.js (animations) est chargé.
 */
(function () {
   "use strict";

   function esc(s) {
      return String(s == null ? "" : s)
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
   }

   // Mini-markdown : **gras** et *italique*
   function md(s) {
      return esc(s)
         .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
         .replace(/\*(.+?)\*/g, "<em>$1</em>")
         .replace(/\n/g, "<br>");
   }

   function safeUrl(u) {
      u = String(u || "#").trim();
      return /^(https?:|mailto:|tel:|#|[\w./-])/i.test(u) && !/^javascript:/i.test(u) ? u : "#";
   }

   function getJSON(url) {
      return fetch(url, { cache: "no-cache" }).then(function (r) {
         if (!r.ok) throw new Error(url + " : " + r.status);
         return r.json();
      });
   }

   function renderProjet(p) {
      var right = !!p.image_a_droite;
      var img = '<div class="col-lg-7 project_img" role="img" aria-label="' + esc(p.titre) + '"' +
         ' style="background-image:url(\'' + esc(encodeURI(p.image)) + '\');transition:1.5s;"' +
         ' data-aos="' + (right ? "slide-right" : "slide-left") + '" data-aos-duration="1500"></div>';

      var detail = (p.description || []).map(md).join("<br>");
      if (p.liste && p.liste.elements && p.liste.elements.length) {
         detail += "<br><br><strong>" + esc(p.liste.titre || "Réalisations") + "</strong> :<ul>" +
            p.liste.elements.map(function (li) { return "<li>" + md(li) + "</li>"; }).join("") + "</ul>";
      } else {
         detail += "<br><br>";
      }
      if (p.fonctionnalites && p.fonctionnalites.length) {
         detail += "<strong>Fonctionnalités</strong> : " + p.fonctionnalites.map(esc).join(" - ") + "<br><br>";
      }
      if (p.technologies && p.technologies.length) {
         detail += "<strong>Technologies</strong> : " + p.technologies.map(esc).join(" - ");
      }

      var lien = p.lien && p.lien.url
         ? '<div class="project_demo"><a href="' + esc(safeUrl(p.lien.url)) + '"' +
           '><button class="project_link">' + esc(p.lien.libelle || "Voir le projet") + "</button></a></div>"
         : "";

      var info = '<div class="col-lg-5 project_info' + (right ? " project_info_even" : "") + '">' +
         '<div class="project_title">' + esc(p.titre) + "</div>" +
         '<div class="project_detail">' + detail + "</div>" + lien + "</div>";

      return '<div class="row project_row" id="projet-' + esc(p.id) + '">' + (right ? info + img : img + info) + "</div>";
   }

   function renderProfil(pr) {
      function set(key, html) {
         document.querySelectorAll('[data-profil="' + key + '"]').forEach(function (el) { el.innerHTML = html; });
      }
      if (pr.nom) set("nom", esc(pr.nom));
      if (pr.bio) set("bio", md(pr.bio));
      if (pr.titre_realisations) set("titre_realisations", esc(pr.titre_realisations));
      if (pr.titre_expertise) set("titre_expertise", esc(pr.titre_expertise));
      if (pr.expertise) {
         set("expertise", pr.expertise.map(function (g) {
            return '<article class="expertise_group"><h3>' + esc(g.titre) + '</h3><div class="expertise_tags">' +
               (g.elements || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") +
               "</div></article>";
         }).join(""));
      }
      if (pr.photo) {
         document.querySelectorAll(".profile_photo").forEach(function (im) { im.src = pr.photo; im.alt = pr.nom || im.alt; });
      }
      if (pr.lien_a_propos) {
         document.querySelectorAll(".nav_about_link").forEach(function (a) { a.href = safeUrl(pr.lien_a_propos); });
      }
      var c = pr.contact || {};
      if (c.accroche) document.querySelectorAll(".cline2").forEach(function (el) { el.textContent = c.accroche; });
      if (c.email) document.querySelectorAll(".contact_action_mail a").forEach(function (a) { a.href = "mailto:" + c.email; });
      if (c.github) document.querySelectorAll(".contact_action_github a").forEach(function (a) { a.href = safeUrl(c.github); });
   }

   function loadAnimations() {
      var s = document.createElement("script");
      s.src = "script.js";
      document.body.appendChild(s);
   }

   var box = document.getElementById("projets");

   Promise.allSettled([getJSON("data/profil.json"), getJSON("data/projets.json")]).then(function (res) {
      if (res[0].status === "fulfilled") renderProfil(res[0].value);
      else console.error(res[0].reason);

      if (res[1].status === "fulfilled") {
         var projets = (res[1].value.projets || []).filter(function (p) { return p.visible !== false; });
         box.innerHTML = projets.map(renderProjet).join("");
      } else {
         console.error(res[1].reason);
         box.innerHTML = '<p class="project_loading">Impossible de charger les réalisations pour le moment.</p>';
      }
      loadAnimations();
   });
})();
