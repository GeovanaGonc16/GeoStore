const themeToggle = document.getElementById('themeToggle')
const htmlElement = document.documentElement

const savedTheme = localStorage.getItem('theme') || 'light'

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode')
  themeToggle.textContent = '☀️'
} else {
  themeToggle.textContent = '🌙'
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode')

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark')
    themeToggle.textContent = '☀️'
  } else {
    localStorage.setItem('theme', 'light')
    themeToggle.textContent = '🌙'
  }
})
