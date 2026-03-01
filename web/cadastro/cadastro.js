const form = document.getElementById('produtoForm')
const mensagem = document.getElementById('mensagem')
const formTitle = document.getElementById('formTitle')
const formSubtitle = document.getElementById('formSubtitle')
const submitBtn = document.getElementById('submitBtn')

let produtoId = null
let isEditing = false

// Verificar se é edição (parâmetro ?edit=id na URL)
const urlParams = new URLSearchParams(window.location.search)
if (urlParams.has('edit')) {
  produtoId = urlParams.get('edit')
  isEditing = true
  carregarProdutoParaEdicao(produtoId)
}

async function carregarProdutoParaEdicao(id) {
  try {
    const response = await fetch(`http://localhost:3000/produtos/${id}`)
    const data = await response.json()

    if (data.success && data.data) {
      const produto = data.data

      // Preencher o formulário com os dados do produto
      document.getElementById('nome').value = produto.name || ''
      document.getElementById('preco').value = produto.price || ''
      document.getElementById('categoria').value = produto.category || ''
      document.getElementById('descricao').value = produto.description || ''

      // Atualizar títulos e botão
      formTitle.textContent = 'Editar Produto'
      formSubtitle.textContent = 'Modifique as informações do produto e salve as alterações'
      submitBtn.textContent = 'Salvar Alterações'
    } else {
      mostrarMensagem('Erro ao carregar produto', 'erro')
      setTimeout(() => {
        window.location.href = '../produtos/produtos.html'
      }, 2000)
    }
  } catch (error) {
    console.error('Erro ao carregar produto:', error)
    mostrarMensagem('Erro ao conectar com o servidor', 'erro')
    setTimeout(() => {
      window.location.href = '../produtos/produtos.html'
    }, 2000)
  }
}

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
    const url = isEditing ? `http://localhost:3000/produtos/${produtoId}` : 'http://localhost:3000/produtos'
    const method = isEditing ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method: method,
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
      const mensagemSucesso = isEditing ? 'Produto editado com sucesso!' : 'Produto cadastrado com sucesso!'
      mostrarMensagem(mensagemSucesso, 'sucesso')
      form.reset()

      setTimeout(() => {
        window.location.href = '../produtos/produtos.html'
      }, 1500)
    } else {
      mostrarMensagem(data.message || 'Erro ao salvar produto', 'erro')
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
