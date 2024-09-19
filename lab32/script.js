document.getElementById("submit-btn").addEventListener("click", function () {
    let score = 0;
    let totalQuestions = 2;
    
    // Respostas corretas
    const correctAnswers = {
        q1: "M249",
        q2: "4750"
    };

    // Verificar cada pergunta
    const form = document.getElementById("quiz-form");
    const resultDiv = document.getElementById("result");

    // Reset styles and messages
    document.querySelectorAll('.question').forEach(q => q.classList.remove('correct', 'incorrect'));

    for (let question in correctAnswers) {
        const userAnswer = form[question].value;
        const questionDiv = form[question].closest(".question");

        if (userAnswer === correctAnswers[question]) {
            score++;
            questionDiv.classList.add('correct');
        } else {
            questionDiv.classList.add('incorrect');
        }
    }

    // Exibir pontuação
    resultDiv.innerHTML = `Você acertou ${score} de ${totalQuestions} perguntas.`;

    // Exibir o botão de reiniciar
    document.getElementById("reset-btn").style.display = 'block';
});

document.getElementById("reset-btn").addEventListener("click", function () {
    // Reset quiz
    document.getElementById("quiz-form").reset();
    document.getElementById("result").innerHTML = '';
    
    // Reset styles
    document.querySelectorAll('.question').forEach(q => q.classList.remove('correct', 'incorrect'));
    
    // Ocultar o botão de reiniciar
    this.style.display = 'none';
});
