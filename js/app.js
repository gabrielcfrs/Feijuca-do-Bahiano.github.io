// =============================================
// FEIJUCA DO BAHIANO - JAVASCRIPT PRINCIPAL
// Arquivo: app.js
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  // ================================================
  // PARTE 1 — SISTEMA DE CARRINHO
  // ================================================

  var carrinho = [];

  var btnCarrinho     = document.getElementById("btn-carrinho");
  var painelCarrinho  = document.getElementById("carrinho-painel");
  var overlayCarrinho = document.getElementById("carrinho-overlay");
  var btnFechar       = document.getElementById("carrinho-fechar");
  var listaCarrinho   = document.getElementById("carrinho-lista");
  var textoVazio      = document.getElementById("carrinho-vazio");
  var rodapeCarrinho  = document.getElementById("carrinho-footer");
  var totalValor      = document.getElementById("carrinho-total-valor");
  var badge           = document.getElementById("carrinho-badge");
  var btnPedido       = document.getElementById("btn-pedido");
  var btnLimpar       = document.getElementById("btn-limpar");

  function abrirCarrinho() {
    painelCarrinho.classList.add("aberto");
    overlayCarrinho.classList.add("ativo");
  }

  function fecharCarrinho() {
    painelCarrinho.classList.remove("aberto");
    overlayCarrinho.classList.remove("ativo");
  }

  btnCarrinho.addEventListener("click", abrirCarrinho);
  btnFechar.addEventListener("click", fecharCarrinho);
  overlayCarrinho.addEventListener("click", fecharCarrinho);

  btnLimpar.addEventListener("click", function () {
    carrinho = [];
    renderizarCarrinho();
  });

  function adicionarAoCarrinho(item) {
    var indice = carrinho.findIndex(function (c) {
      return c.nome === item.nome;
    });

    if (indice === -1) {
      carrinho.push({
        nome: item.nome,
        preco: item.preco,
        precoNum: item.precoNum,
        imagem: item.imagem,
        quantidade: 1
      });
    } else {
      carrinho[indice].quantidade++;
    }

    renderizarCarrinho();

    badge.classList.remove("badge-pulando");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        badge.classList.add("badge-pulando");
      });
    });

    abrirCarrinho();
  }

  function calcularTotal() {
    return carrinho.reduce(function (acumulador, item) {
      return acumulador + (item.precoNum * item.quantidade);
    }, 0);
  }

  function renderizarCarrinho() {
    var totalItens = carrinho.length;
    badge.textContent = totalItens;

    if (totalItens === 0) {
      listaCarrinho.innerHTML = "";
      textoVazio.style.display = "block";
      rodapeCarrinho.style.display = "none";
      return;
    }

    textoVazio.style.display = "none";
    rodapeCarrinho.style.display = "block";

    listaCarrinho.innerHTML = carrinho.map(function (item, indice) {
      var subtotal = (item.precoNum * item.quantidade).toFixed(2);
      return `
        <li class="carrinho-item">
          <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
          <div class="carrinho-item-info">
            <div class="carrinho-item-nome">${item.nome}</div>
            <div class="carrinho-item-preco">R$ ${subtotal.replace(".", ",")}</div>
          </div>
          <div class="carrinho-item-qtd">
            <button class="btn-qtd btn-diminuir" data-indice="${indice}">−</button>
            <span class="qtd-num">${item.quantidade}</span>
            <button class="btn-qtd btn-aumentar" data-indice="${indice}">+</button>
          </div>
        </li>
      `;
    }).join("");

    var total = calcularTotal();
    totalValor.textContent = "R$ " + total.toFixed(2).replace(".", ",");

    var mensagem = "Olá! Quero fazer o seguinte pedido:\n\n";
    carrinho.forEach(function (item) {
      mensagem += "• " + item.quantidade + "x " + item.nome + " (" + item.preco + ")\n";
    });
    mensagem += "\n*Total: R$ " + total.toFixed(2).replace(".", ",") + "*";

    var linkWhatsApp = "https://wa.me/5511961031119?text=" + encodeURIComponent(mensagem);
    btnPedido.href = linkWhatsApp;

    document.querySelectorAll(".btn-diminuir").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-indice"));
        if (carrinho[idx].quantidade > 1) {
          carrinho[idx].quantidade--;
        } else {
          carrinho.splice(idx, 1);
        }
        renderizarCarrinho();
      });
    });

    document.querySelectorAll(".btn-aumentar").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-indice"));
        carrinho[idx].quantidade++;
        renderizarCarrinho();
      });
    });
  }

  renderizarCarrinho();


  // ================================================
  // PARTE 2 — CRIAR OS CARDS DO CARDÁPIO (FEIJOADAS)
  // ================================================

  var listaItens = document.getElementById("lista-itens");

  function tagCategoria(cat) {
    if (cat === "feijoada") return "🫘 Feijoada";
    if (cat === "light")    return "🥗 Light";
    return cat;
  }

  function criarCardItem(item) {
    return `
      <li class="card" data-categoria="${item.categoria}">
        <div class="card-img-wrap">
          <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="card-tag">${tagCategoria(item.categoria)}</span>
          <h3>${item.nome}</h3>
          <p>${item.descricao}</p>
          <p class="preco">${item.preco}</p>
          <button class="btn-adicionar" onclick='adicionarAoCarrinho(${JSON.stringify(item)})'>
            🛒 Adicionar ao Carrinho
          </button>
        </div>
      </li>
    `;
  }

  listaItens.innerHTML = ITENS.map(criarCardItem).join("");


  // ================================================
  // PARTE 3 — BEBIDAS
  // ================================================

  var listaBebidas = document.getElementById("lista-bebidas");

  function criarCardBebida(bebida) {
    return `
      <li class="card">
        <div class="card-img-wrap">
          <img src="${bebida.imagem}" alt="${bebida.nome}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="card-tag">🥤 Bebida</span>
          <h3>${bebida.nome}</h3>
          <p>${bebida.descricao}</p>
          <p class="preco">${bebida.preco}</p>
          <button class="btn-adicionar" onclick='adicionarAoCarrinho(${JSON.stringify(bebida)})'>
            🛒 Adicionar ao Carrinho
          </button>
        </div>
      </li>
    `;
  }

  listaBebidas.innerHTML = BEBIDAS.map(criarCardBebida).join("");


  // ================================================
  // PARTE 4 — SOBREMESAS
  // ================================================

  var listaSobremesas = document.getElementById("lista-sobremesas");

  function criarCardSobremesa(sobremesa) {
    return `
      <li class="card">
        <div class="card-img-wrap">
          <img src="${sobremesa.imagem}" alt="${sobremesa.nome}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="card-tag">🍮 Sobremesa</span>
          <h3>${sobremesa.nome}</h3>
          <p>${sobremesa.descricao}</p>
          <p class="preco">${sobremesa.preco}</p>
          <button class="btn-adicionar" onclick='adicionarAoCarrinho(${JSON.stringify(sobremesa)})'>
            🛒 Adicionar ao Carrinho
          </button>
        </div>
      </li>
    `;
  }

  listaSobremesas.innerHTML = SOBREMESAS.map(criarCardSobremesa).join("");


  // ================================================
  // PARTE 5 — FILTROS DO CARDÁPIO
  // ================================================

  var botoesFiltro = document.querySelectorAll(".filtro-btn");

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
      botoesFiltro.forEach(function (b) { b.classList.remove("ativo"); });
      this.classList.add("ativo");

      var filtroEscolhido = this.getAttribute("data-filtro");
      var todosOsCards = document.querySelectorAll("#lista-itens .card");

      todosOsCards.forEach(function (card) {
        var categoriaDoCard = card.getAttribute("data-categoria");
        if (filtroEscolhido === "todos" || categoriaDoCard === filtroEscolhido) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });


  // ================================================
  // PARTE 6 — FORMULÁRIO DE CONTATO
  // ================================================

  var form   = document.getElementById("form-contato");
  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nome  = document.getElementById("nome").value.trim();
    var email = document.getElementById("email").value.trim();

    if (nome === "" || email === "") {
      status.textContent = "⚠️ Por favor, preencha nome e e-mail!";
      status.style.color = "#f77f00";
      return;
    }

    status.textContent = "✅ Mensagem enviada! Retornaremos em breve.";
    status.style.color = "#25d366";
    form.reset();

    setTimeout(function () {
      status.textContent = "";
    }, 5000);
  });


  // ================================================
  // PARTE 7 — MENU MOBILE
  // ================================================

  var botaoMenu = document.getElementById("menu-toggle");
  var listaNav  = document.getElementById("nav-list");

  botaoMenu.addEventListener("click", function () {
    listaNav.classList.toggle("aberto");
    botaoMenu.textContent = listaNav.classList.contains("aberto") ? "✕" : "☰";
  });

  document.querySelectorAll(".nav-list a").forEach(function (link) {
    link.addEventListener("click", function () {
      listaNav.classList.remove("aberto");
      botaoMenu.textContent = "☰";
    });
  });


  // ================================================
  // PARTE 8 — ANO NO FOOTER
  // ================================================

  document.getElementById("ano").textContent = new Date().getFullYear();


  // ================================================
  // PARTE 9 — SCROLL SUAVE
  // ================================================

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var alvo = document.querySelector(this.getAttribute("href"));
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: "smooth" });
      }
    });
  });


  // ================================================
  // EXPOSIÇÃO GLOBAL
  // ================================================

  window.adicionarAoCarrinho = adicionarAoCarrinho;

});
