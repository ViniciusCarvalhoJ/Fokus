const html = document.querySelector("html");

const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");

const musicaFocoInput = document.querySelector("#alternar-musica");
const startPauseBt = document.querySelector("#start-pause");

const start = document.querySelector(".app__card-primary-button");
const title = document.querySelector(".app__title");
const displayTempo = document.querySelector("#timer");
const banner = document.querySelector(".app__image");
const botoes = document.querySelectorAll(".app__card-button");
const iniciarOuPausarbt = document.querySelector("#start-pause span");
const tempoNaTela = document.querySelector('#timer');

const musica = new Audio("/sons/luna-rise-part-one.mp3");
const audioPlay = new Audio("/sons/play.wav");
const audioPausar = new Audio("/sons/pause.mp3");
const audioTempoFinalizado = new Audio("/sons/beep.mp3");

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true

musicaFocoInput.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

start.addEventListener("click", () => {
  html.setAttribute("app__card-primary-button", ".app__card-primary-button");
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

focoBt.addEventListener("click", () => {
  tempoDecorridoEmSegundos = 1500;
  alterarContexto("foco");
  focoBt.classList.add("active");
});

curtoBt.addEventListener("click", () => {
  tempoDecorridoEmSegundos = 300;
  alterarContexto("descanso-curto");
  curtoBt.classList.add("active");
});

longoBt.addEventListener("click", () => {
  tempoDecorridoEmSegundos = 900;
  alterarContexto("descanso-longo");
  longoBt.classList.add("active");
});

function alterarContexto(contexto) {
  mostrarTempo();
  //|Removendo o background dos botoes
  botoes.forEach(function (contexto) {
    contexto.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  banner.setAttribute("src", `/imagens/${contexto}.png`);
  switch (contexto) {
    case "foco":
      title.innerHTML = `
        Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;

      break;
    case "descanso-curto":
      title.innerHTML = `Que tal dar uma respirada?  
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`;

      break;
    case "descanso-longo":
      title.innerHTML = `Hora de voltar a superfíce.
        <strong class="app__title-strong"> Faça uma pausa longa.</strong>`;
    default:
      break;
  }
}

// !Função de contagem regressiva
const contagemRegressiva = () => {
  if (tempoDecorridoEmSegundos <= 0) {
    audioTempoFinalizado.play();
    alert('Tempo finalizado');
    //!brodcast de um evento - Criação de um evento, FocoFinalizado
    const focoAtivo = html.getAttribute('data-contexto') == 'foco';
    if (focoAtivo) {
      const evento = new CustomEvent('FocoFinalizado');
      document.dispatchEvent(evento);
    }
    zerar ();
    
    return
  };
  tempoDecorridoEmSegundos -= 1;
  mostrarTempo ();
};

startPauseBt.addEventListener("click", iniciarOuPausar);

//!Função para iniciar ou pausar o temporizador
function iniciarOuPausar() {
  if (intervaloId) {
    audioPausar.play(); //Toca o áudio de pausa
    zerar();
    return; //Retorna imediatamente se já estiver em andamento
  }
  audioPlay.play(); // Toca o áudio de play
  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarbt.textContent = "Pausar";
}

function zerar() {
  clearInterval(intervaloId);
  iniciarOuPausarbt.textContent = "Começar";
  intervaloId = null;
  
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000);
  const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
  tempoNaTela.innerHTML = `${tempoFormatado}`; 
}

mostrarTempo()