
"use strict";

/* =================================
   1. SELEÇÃO DOS ELEMENTOS
================================= */

const botaoProjetos = document.getElementById("btn-hero");
const secaoProjetos = document.getElementById("projetos");
const logo = document.getElementById("logo");
const anoRodape = document.getElementById("ano");

const secoes = document.querySelectorAll(
  "main section[id]"
);

const linksMenu = document.querySelectorAll(
  ".menu-link"
);

const elementosAnimados = document.querySelectorAll(
  ".secao, .projeto-card, .skill-tag"
);

const movimentoReduzido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =================================
   2. BOTÃO "VER MEUS PROJETOS"
================================= */

if (botaoProjetos && secaoProjetos) {
  botaoProjetos.addEventListener("click", () => {
    secaoProjetos.scrollIntoView({
      behavior: movimentoReduzido ? "auto" : "smooth",
      block: "start"
    });
  });
}


/* =================================
   3. LOGO: VOLTAR AO INÍCIO
================================= */

if (logo) {
  logo.setAttribute("role", "button");
  logo.setAttribute("tabindex", "0");
  logo.setAttribute("aria-label", "Voltar ao início");

  function voltarAoInicio() {
    document.getElementById("hero")?.scrollIntoView({
      behavior: movimentoReduzido ? "auto" : "smooth",
      block: "start"
    });
  }

  logo.addEventListener("click", voltarAoInicio);

  logo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      voltarAoInicio();
    }
  });
}


/* =================================
   4. ANO AUTOMÁTICO NO RODAPÉ
================================= */

if (anoRodape) {
  anoRodape.textContent = new Date().getFullYear();
}


/* =================================
   5. MENU COM SEÇÃO ATIVA
================================= */

function atualizarLinkAtivo(idSecao) {
  linksMenu.forEach((link) => {
    const destino = link.getAttribute("href");

    if (destino === `#${idSecao}`) {
      link.classList.add("ativo");
      link.setAttribute("aria-current", "location");
    } else {
      link.classList.remove("ativo");
      link.removeAttribute("aria-current");
    }
  });
}

// Destaca a seção quando um link do menu é clicado.
linksMenu.forEach((link) => {
  link.addEventListener("click", () => {
    const destino = link.getAttribute("href");

    if (destino && destino.startsWith("#")) {
      atualizarLinkAtivo(destino.slice(1));
    }
  });
});

// Atualiza o menu conforme a seção visível.
if ("IntersectionObserver" in window) {
  const observadorSecoes = new IntersectionObserver(
    (entradas) => {
      const visiveis = entradas
        .filter((entrada) => entrada.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (visiveis.length > 0) {
        atualizarLinkAtivo(visiveis[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5]
    }
  );

  secoes.forEach((secao) => {
    observadorSecoes.observe(secao);
  });
}


/* =================================
   6. ANIMAÇÕES DE ENTRADA
================================= */

// Sem suporte ao IntersectionObserver ou com movimento
// reduzido, os elementos permanecem visíveis.
if (
  !movimentoReduzido &&
  "IntersectionObserver" in window
) {
  elementosAnimados.forEach((elemento) => {
    elemento.classList.add("revelar");
  });

  const observadorAnimacoes = new IntersectionObserver(
    (entradas, observador) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elementosAnimados.forEach((elemento) => {
    observadorAnimacoes.observe(elemento);
  });
}


/* =================================
   7. ACESSIBILIDADE DOS LINKS
================================= */

// Garante que os links de navegação apontem
// para seções existentes na página.
linksMenu.forEach((link) => {
  const destino = link.getAttribute("href");

  if (
    destino &&
    destino.startsWith("#") &&
    !document.getElementById(destino.slice(1))
  ) {
    console.warn(
      `A seção ${destino} não foi encontrada no HTML.`
    );
  }
});
