const screens = ['library', 'quiz', 'chat'];
const titles = { library: 'Library', quiz: 'Quiz time', chat: 'Connect' };
document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.screen;
  for (const screen of screens) {
    const active = screen === selected;
    document.querySelector('#' + screen + '-screen').hidden = !active;
    const tab = document.querySelector('.tab[data-screen="' + screen + '"]');
    tab.classList.toggle('active', active);
    if (active) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  document.querySelector('#screen-title').textContent = titles[selected];
  document.querySelector('.app-content').scrollTop = 0;
}));

const topics = [...document.querySelectorAll('.topic-card')];
const search = document.querySelector('#library-search');
const updateTopics = () => {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  topics.forEach(topic => {
    topic.hidden = !topic.dataset.topic.toLowerCase().includes(query);
    if (!topic.hidden) count++;
  });
  document.querySelector('#topic-count').textContent = count + ' topics';
  document.querySelector('#topic-empty').hidden = count !== 0;
};
search.addEventListener('input', updateTopics);
updateTopics();
const topicDialog = document.querySelector('#topic-dialog');
topics.forEach(topic => topic.addEventListener('click', () => {
  document.querySelector('#topic-title').textContent = topic.dataset.topic;
  document.querySelector('#topic-description').textContent = topic.dataset.description;
  topicDialog.showModal();
}));
document.querySelector('#close-topic').addEventListener('click', () => topicDialog.close());
topicDialog.addEventListener('click', event => { if (event.target === topicDialog) topicDialog.close(); });

const questions = [
  { text: 'What does HTML primarily describe?', answers: ['The structure of a web page', 'A database query', 'A server deployment'], correct: 0 },
  { text: 'Which language is commonly used to add interaction to web pages?', answers: ['CSS', 'JavaScript', 'SQL'], correct: 1 },
  { text: 'What does CSS mainly control?', answers: ['Page styling and layout', 'User authentication', 'Cloud storage'], correct: 0 }
];
let questionIndex = 0;
let score = 0;
let answered = false;
function renderQuestion() {
  answered = false;
  const question = questions[questionIndex];
  document.querySelector('#question-number').textContent = questionIndex + 1;
  document.querySelector('#score-label').textContent = score + ' POINTS';
  document.querySelector('#progress-fill').style.width = ((questionIndex + 1) / questions.length * 100) + '%';
  document.querySelector('#question-text').textContent = question.text;
  document.querySelector('#quiz-feedback').textContent = '';
  document.querySelector('#next-question').hidden = true;
  const list = document.querySelector('#answer-list');
  list.replaceChildren();
  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = answer;
    button.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = index === question.correct;
      if (correct) score++;
      [...list.children].forEach((choice, choiceIndex) => {
        choice.disabled = true;
        if (choiceIndex === question.correct) choice.classList.add('correct');
        else if (choiceIndex === index) choice.classList.add('incorrect');
      });
      document.querySelector('#score-label').textContent = score + ' POINTS';
      document.querySelector('#quiz-feedback').textContent = correct ? 'Correct! Nicely done.' : 'Not quite. The highlighted answer is correct.';
      const next = document.querySelector('#next-question');
      next.textContent = questionIndex === questions.length - 1 ? 'Start again ↻' : 'Next question ↗';
      next.hidden = false;
    });
    list.append(button);
  });
}
document.querySelector('#next-question').addEventListener('click', () => {
  if (questionIndex === questions.length - 1) { questionIndex = 0; score = 0; }
  else questionIndex++;
  renderQuestion();
});
renderQuestion();

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const message = input.value.trim();
  if (!message) return;
  const bubble = document.createElement('div');
  bubble.className = 'message message-me';
  const author = document.createElement('span');
  author.textContent = 'You · just now';
  const body = document.createElement('p');
  body.textContent = message;
  bubble.append(author, body);
  document.querySelector('#chat-messages').append(bubble);
  input.value = '';
  bubble.scrollIntoView({ block: 'nearest' });
});
