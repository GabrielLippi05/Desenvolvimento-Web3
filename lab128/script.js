const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio automático do formulário
    let valid = true;

    // Limpar mensagens de erro
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';

    // Validação do campo nome
    if (nameInput.value.trim() === '') {
        document.getElementById('nameError').textContent = 'Por favor, insira seu nome.';
        valid = false;
    }

    // Validação do campo e-mail
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        document.getElementById('emailError').textContent = 'Por favor, insira um e-mail válido.';
        valid = false;
    }

    // Validação do campo mensagem
    if (messageInput.value.trim() === '') {
        document.getElementById('messageError').textContent = 'Por favor, insira uma mensagem.';
        valid = false;
    }

    if (valid) {
        // Se os campos estão corretos, mostrar a mensagem de sucesso
        successMessage.textContent = 'Mensagem enviada com sucesso!';
        
        // Enviar os dados para o Formspree
        fetch('https://formspree.io/f/{SEU_FORM_ID}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            })
        })
        .then(response => {
            if (response.ok) {
                successMessage.textContent = 'Sua mensagem foi enviada com sucesso!';
                form.reset(); // Limpar o formulário
            } else {
                successMessage.textContent = 'Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.';
            }
        })
        .catch(error => {
            successMessage.textContent = 'Ocorreu um erro: ' + error.message;
        });
    }
});
