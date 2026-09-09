// Knowledge-check quiz scoring (Section 31)
export function initQuiz() {
(function(){
  var btn = document.getElementById('quizSubmit');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var questions = document.querySelectorAll('.quiz-q');
    var score = 0;
    questions.forEach(function(q){
      var answer = q.getAttribute('data-answer');
      var checked = q.querySelector('input[type=radio]:checked');
      q.classList.remove('correct', 'incorrect');
      if(checked && checked.value === answer){
        score++;
        q.classList.add('correct');
      } else {
        q.classList.add('incorrect');
      }
    });
    var out = document.getElementById('quizScore');
    out.style.display = 'block';
    out.innerHTML = '$ knowledge-check --result<br>Score: ' + score + ' / ' + questions.length +
      '<br>Green boxes: correct. Red boxes: worth a re-read of that section.';
    out.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  });
})();
}
