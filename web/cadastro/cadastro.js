const form = document.getElementById('produtoForm')
const mensagem = document.getElementById('mensagem')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const nome = document.getElementById('nome').value.trim()
  const preco = document.getElementById('preco').value.trim()
  const categoria = document.getElementById('categoria').value.trim()
  const descricao = document.getElementById('descricao').value.trim()

  if (!nome || !preco || !categoria) {
    mostrarMensagem('Por favor, preencha todos os campos obrigatórios', 'erro')
    return
  }

  try {
    const response = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nome,
        price: parseFloat(preco),
        category: categoria,
        description: descricao
      })
    })

    const data = await response.json()

    if (data.success) {
      mostrarMensagem('Produto cadastrado com sucesso!', 'sucesso')
      form.reset()

      setTimeout(() => {
        window.location.href = '../produtos/produtos.html'
      }, 1500)
    } else {
      mostrarMensagem(data.message || 'Erro ao cadastrar produto', 'erro')
    }
  } catch (error) {
    console.error('Erro:', error)
    mostrarMensagem('Erro ao conectar com o servidor', 'erro')
  }
})

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto
  mensagem.className = `mensagem ${tipo}`

  setTimeout(() => {
    mensagem.className = 'mensagem'
  }, 4000)
}
