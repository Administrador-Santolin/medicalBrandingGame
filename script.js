let currentQuestion = 0;
let totalScore = 0;
let badges = [];
let answers = {};

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    showQuestion(1);
    updateProgress();
}

function showQuestion(questionNum) {
    // Hide all questions
    const questions = document.querySelectorAll('.question-container');
    questions.forEach(q => q.classList.remove('active'));

    // Show current question
    document.getElementById(`question${questionNum}`).classList.add('active');
    currentQuestion = questionNum;
    updateProgress();
}

function selectOption(questionNum, points, badge) {
    // Remove previous selections
    const options = document.querySelectorAll(`#question${questionNum} .option`);
    options.forEach(opt => opt.classList.remove('selected'));

    // Add selection to clicked option
    event.currentTarget.classList.add('selected');

    // Store answer
    answers[`question${questionNum}`] = {
        points: points,
        badge: badge,
        value: event.currentTarget.dataset.value
    };

    // Wait a bit then move to next question
    setTimeout(() => {
        nextQuestion(questionNum);
    }, 800);
}

function toggleCheckbox(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const item = checkbox.parentElement;

    // Handle "nenhuma" exclusive selection
    if (checkboxId === 'nenhuma') {
        if (checkbox.checked) {
            // Uncheck all others
            document.querySelectorAll('#question4 input[type="checkbox"]').forEach(cb => {
                if (cb.id !== 'nenhuma') {
                    cb.checked = false;
                    cb.parentElement.classList.remove('selected');
                }
            });
        }
    } else {
        // If selecting others, uncheck "nenhuma"
        const nenhuma = document.getElementById('nenhuma');
        if (nenhuma.checked) {
            nenhuma.checked = false;
            nenhuma.parentElement.classList.remove('selected');
        }
    }

    checkbox.checked = !checkbox.checked;
    item.classList.toggle('selected', checkbox.checked);

    // Enable continue button if at least one is selected
    const anyChecked = document.querySelectorAll('#question5 input[type="checkbox"]:checked').length > 0;
    document.getElementById('socialBtn').disabled = !anyChecked;
}

function nextQuestion(questionNum) {
    // Calculate points for current question
    if (questionNum === 5) {
        // Handle multiple selection for social media
        let questionPoints = 0;
        let questionBadges = [];

        const checkboxes = document.querySelectorAll('#question5 input[type="checkbox"]:checked');
        checkboxes.forEach(cb => {
            questionPoints += parseInt(cb.value);
            const badgeElement = cb.parentElement.querySelector('.badge');
            if (badgeElement) {
                questionBadges.push(badgeElement.textContent.trim());
            }
        });

        answers[`question${questionNum}`] = {
            points: questionPoints,
            badges: questionBadges,
            values: Array.from(checkboxes).map(cb => cb.id)
        };
    }

    // Add points and badges
    const answer = answers[`question${questionNum}`];
    if (answer) {
        totalScore += answer.points;
        if (answer.badge) badges.push(answer.badge);
        if (answer.badges) badges = badges.concat(answer.badges);
    }

    // Move to next question or show result
    if (questionNum < 7) {
        showQuestion(questionNum + 1);
    } else {
        showResult();
    }
}

function updateProgress() {
    const progress = ((currentQuestion) / 7) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function showResult() {
    document.querySelector('.question-container.active').classList.remove('active');
    document.getElementById('resultScreen').style.display = 'block';
    updateProgress();

    let profile, avatar, description;

    if (totalScore <= 300) {
        profile = "🌱 Iniciante Digital";
        avatar = "🏆";
        description = "Você está no início da sua jornada digital! Tem muito potencial para crescer e construir uma marca médica sólida. Vamos trabalhar as bases juntos!";
    } else if (totalScore <= 600) {
        profile = "🚀 Crescimento Acelerado";
        avatar = "🏆";
        description = "Você já tem movimento e está no caminho certo! É hora de estruturar melhor sua estratégia e acelerar seu crescimento no branding médico.";
    } else {
        profile = "👑 Expert em Construção";
        avatar = "🏆";
        description = "Impressionante! Você já é um profissional estabelecido no digital. Vamos refinar sua estratégia e expandir ainda mais sua marca médica.";
    }

    document.getElementById('resultTitle').textContent = profile;
    document.getElementById('resultAvatar').textContent = avatar;
    document.getElementById('showScore').innerHTML = `<h2>${totalScore} de 1.100 pontos.</h2>`;
    document.getElementById('resultDescription').textContent = description;

    // Show earned badges
    const badgesContainer = document.getElementById('badgesEarned');
    badgesContainer.innerHTML = '';
    const uniqueBadges = [...new Set(badges)];
    uniqueBadges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'earned-badge';
        badgeElement.textContent = badge;
        badgesContainer.appendChild(badgeElement);
    });
}

function shareResult(platform) {
    const profile = document.getElementById('resultTitle').textContent;
    const score = totalScore;
    const text = `Acabei de descobrir meu perfil no Branding Médico: ${profile} com ${score} pontos! 🏥✨ #BrandingMedico #MedicinaDigital`;

    if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=&text=${encodeURIComponent(text)}`);
    } else if (platform === 'instagram') {
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado! Cole no seu Instagram Stories 📱');
        });
    }
}

function shareToWhatsApp() {
    // Captura os dados do resultado
    const profile = document.getElementById('resultTitle').textContent;
    const score = totalScore;
    const uniqueBadges = [...new Set(badges)];
    const badgesText = uniqueBadges.length > 0 ? uniqueBadges.join(', ') : 'Nenhuma badge conquistada';

    // Monta o texto que acompanha o compartilhamento
    const message = `🏥 *MEU RESULTADO - BRANDING MÉDICO* 🏥

📊 *Perfil:* ${profile}
⭐ *Pontuação:* ${score}/1.100 pontos
🏆 *Badges Conquistadas:* ${badgesText}

---

Olá Eduardo! 👋

Acabei de completar o quiz de Branding Médico e gostaria de receber seu feedback especializado sobre meu resultado🚀
`;

    // Número do WhatsApp (formato internacional sem símbolos)
    const phoneNumber = "5548991341874";

    // Monta a URL do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abre o WhatsApp
    window.open(whatsappURL, '_blank');
}