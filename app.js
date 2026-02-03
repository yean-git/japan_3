// HTML 이스케이프 (XSS 방지)
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// DOM 요소
const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  flashcard: document.getElementById("flashcard-screen"),
  result: document.getElementById("result-screen"),
};

const modeButtons = document.querySelectorAll(".mode-btn");
const wordSetSelect = document.getElementById("word-set-select");
const backBtn = document.getElementById("back-btn");
const retryBtn = document.getElementById("retry-btn");
const homeBtn = document.getElementById("home-btn");

// 퀴즈 상태
let currentMode = null;
let currentWords = [];
let quizState = { index: 0, correct: 0, total: 0 };
let flashcardIndex = 0;

// 화면 전환
function showScreen(screenId) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[screenId]?.classList.add("active");

  backBtn.style.display = screenId === "start" ? "none" : "inline-block";
}

// 셔플 (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 퀴즈 시작 (일본어 → 한국어)
function startQuizJaKo(words) {
  currentMode = "quiz-ja-ko";
  currentWords = shuffle(words).slice(0, Math.min(10, words.length));
  quizState = { index: 0, correct: 0, total: currentWords.length };
  showNextQuestion();
  showScreen("quiz");
}

// 퀴즈 시작 (한국어 → 일본어)
function startQuizKoJa(words) {
  currentMode = "quiz-ko-ja";
  currentWords = shuffle(words).slice(0, Math.min(10, words.length));
  quizState = { index: 0, correct: 0, total: currentWords.length };
  showNextQuestion();
  showScreen("quiz");
}

// 다음 퀴즈 문제 표시
function showNextQuestion() {
  const { index, correct, total } = quizState;
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const feedbackEl = document.getElementById("quiz-feedback");

  document.getElementById("quiz-progress").textContent = `${index + 1} / ${total}`;
  document.getElementById("quiz-score").textContent = `정답: ${correct} / ${index}`;
  feedbackEl.textContent = "";
  feedbackEl.className = "quiz-feedback";

  if (index >= total) {
    showResult(correct, total);
    return;
  }

  const current = currentWords[index];
  let options, correctAnswer;

  if (currentMode === "quiz-ja-ko") {
    const wrongOptions = [...new Set(
      currentWords.filter((w) => w.ko !== current.ko).map((w) => w.ko)
    )];
    options = shuffle([current.ko, ...shuffle(wrongOptions).slice(0, 3)]);
    correctAnswer = current.ko;
    questionEl.innerHTML = `<span class="word-ja">${current.ja}</span><br><small class="reading">(${current.reading})</small>`;
  } else {
    const wrongOptions = [...new Set(
      currentWords.filter((w) => w.ja !== current.ja).map((w) => w.ja)
    )];
    options = shuffle([current.ja, ...shuffle(wrongOptions).slice(0, 3)]);
    correctAnswer = current.ja;
    questionEl.innerHTML = `<span class="word-ko">${current.ko}</span>`;
  }

  optionsEl.innerHTML = options
    .map(
      (opt) =>
        `<button class="option-btn" data-answer="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`
    )
    .join("");

  optionsEl.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn, correctAnswer));
  });
}

// 정답 처리
function handleAnswer(btn, correctAnswer) {
  const feedbackEl = document.getElementById("quiz-feedback");
  const optionsEl = document.getElementById("quiz-options");
  const selected = btn.dataset.answer;

  optionsEl.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));

  if (selected === correctAnswer) {
    quizState.correct++;
    feedbackEl.textContent = "정답!";
    feedbackEl.className = "quiz-feedback correct";
    btn.classList.add("correct");
  } else {
    feedbackEl.textContent = `오답! 정답: ${correctAnswer}`;
    feedbackEl.className = "quiz-feedback wrong";
    btn.classList.add("wrong");
  }

  setTimeout(() => {
    quizState.index++;
    showNextQuestion();
  }, 1000);
}

// 결과 화면
function showResult(correct, total) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  document.getElementById("result-score").textContent = `${correct} / ${total} (${percent}%)`;
  document.getElementById("result-message").textContent =
    percent >= 80
      ? "훌륭해요! 잘하고 있어요! 👍"
      : percent >= 60
      ? "괜찮아요! 조금만 더 연습해보세요 💪"
      : "다시 도전해보세요! 화이팅! 🌟";
  showScreen("result");
}

// 플래시카드 시작
function startFlashcard(words) {
  currentMode = "flashcard";
  currentWords = shuffle(words);
  flashcardIndex = 0;
  updateFlashcard();
  showScreen("flashcard");
}

// 플래시카드 업데이트
function updateFlashcard() {
  const container = document.getElementById("flashcard");
  const front = document.getElementById("flashcard-front");
  const back = document.getElementById("flashcard-back");
  const counter = document.getElementById("card-counter");

  if (currentWords.length === 0) return;

  const current = currentWords[flashcardIndex];
  counter.textContent = `${flashcardIndex + 1} / ${currentWords.length}`;

  front.innerHTML = `<span class="word-ja">${current.ja}</span><br><small class="reading">${current.reading}</small>`;
  back.innerHTML = `<span class="word-ko">${current.ko}</span>`;

  container.classList.remove("flipped");
}

// 모드 버튼 클릭
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    const words = getWordSet(wordSetSelect.value);

    if (words.length === 0) {
      alert("단어가 없어요. 다른 세트를 선택해주세요.");
      return;
    }

    if (mode === "quiz-ja-ko") startQuizJaKo(words);
    else if (mode === "quiz-ko-ja") startQuizKoJa(words);
    else if (mode === "flashcard") startFlashcard(words);
  });
});

// 플래시카드 클릭 (뒤집기)
document.getElementById("flashcard-container").addEventListener("click", () => {
  document.getElementById("flashcard").classList.toggle("flipped");
});

// 플래시카드 이전/다음
document.getElementById("prev-card").addEventListener("click", (e) => {
  e.stopPropagation();
  if (flashcardIndex > 0) {
    flashcardIndex--;
    updateFlashcard();
  }
});

document.getElementById("next-card").addEventListener("click", (e) => {
  e.stopPropagation();
  if (flashcardIndex < currentWords.length - 1) {
    flashcardIndex++;
    updateFlashcard();
  }
});

// 뒤로가기
backBtn.addEventListener("click", () => {
  showScreen("start");
});

// 다시 도전
retryBtn.addEventListener("click", () => {
  if (currentMode === "quiz-ja-ko") startQuizJaKo(currentWords);
  else if (currentMode === "quiz-ko-ja") startQuizKoJa(currentWords);
  else if (currentMode === "flashcard") startFlashcard(currentWords);
});

// 홈으로
homeBtn.addEventListener("click", () => {
  showScreen("start");
});
