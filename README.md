# Lista de Tarefas (Todo List)

Projeto simples de lista de tarefas com HTML, CSS e JavaScript puro.

## Recursos

- Adicionar, editar e excluir tarefas
- Marcar como concluída (com animação)
- Contador de tarefas pendentes
- Filtros: Todas / Ativas / Concluídas
- Persistência usando `localStorage`
- Botão "Limpar tudo"
- Animações suaves e efeito glassmorphism no visual
- Undo (desfazer) após exclusão por alguns segundos

## Estrutura de pastas

```
/Meu-projeto
  ├─ index.html
  ├─ app.js
  └─ css/
      └─ style.css
```

## Como usar

1. Abra o arquivo `index.html` diretamente no navegador ou execute um servidor HTTP simples:

```bash
cd /Users/mauro/Documents/Meu-projeto
python3 -m http.server 8000
# e acesse http://localhost:8000
```

2. Comece a digitar uma tarefa e clique em **Adicionar**.
3. Use os filtros no topo para visualizar todas, somente ativas ou somente concluídas.
4. Para editar, clique no botão **Editar** à direita da tarefa.
5. Exclua tarefas com o botão **Excluir**; aparecerá um botão "Desfazer" para restaurá‑la.
6. O botão **Limpar tudo** remove todas as tarefas em lotes.

As tarefas são armazenadas localmente no navegador — permanecem mesmo após recarregar a página.

## Publicação

Você pode hospedar o projeto em qualquer servidor estático, como GitHub Pages:

1. Crie um repositório no GitHub e faça commit dos arquivos acima.
2. Nas configurações do repositório, ative **GitHub Pages** apontando para a `main` branch ou `/docs`.
3. Pronto, a aplicação ficará disponível em `https://<seu-usuario>.github.io/<repo>`.

## Personalização

- Mude cores no `css/style.css` (variáveis em `:root`).
- Adicione animações extras ou integração com backend se desejar.

## Licença

Projeto de demonstração; sinta-se à vontade para usar e modificar.
