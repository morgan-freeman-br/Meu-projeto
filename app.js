/* Lista de Tarefas - app.js (persistência, editar, contador, animações) */
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('todo-form');
	const input = document.getElementById('todo-input');
	const list = document.getElementById('todo-list');
	const clearBtn = document.getElementById('clear-button');
	const countEl = document.getElementById('todo-count');
	const STORAGE_KEY = 'todos_v1';

	let todos = [];
	let currentFilter = 'all';
	let lastDeleted = null; // { todo, index }
	let undoTimer = null;

	function save() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}

	function load() {
		const raw = localStorage.getItem(STORAGE_KEY);
		todos = raw ? JSON.parse(raw) : [];
		// ensure each todo has an id
		todos = todos.map(t => t.id ? t : Object.assign({ id: Date.now() + Math.random() }, t));
	}

	function updateCount() {
		const pending = todos.filter(t => !t.done).length;
		countEl.textContent = `${pending} pendente${pending === 1 ? '' : 's'}`;
	}

	function render() {
		list.innerHTML = '';
		const filtered = todos.filter(t => {
			if (currentFilter === 'all') return true;
			if (currentFilter === 'active') return !t.done;
			if (currentFilter === 'completed') return !!t.done;
			return true;
		});
		filtered.forEach(todo => renderTodo(todo));
		clearBtn.disabled = todos.length === 0;
		updateCount();
	}

	function findIndexById(id) {
		return todos.findIndex(t => t.id === id);
	}

	function renderTodo(todo) {
		const li = document.createElement('li');
		li.dataset.id = todo.id;

		const left = document.createElement('div');
		left.style.display = 'flex';
		left.style.alignItems = 'center';
		left.style.gap = '8px';

		const chk = document.createElement('input');
		chk.type = 'checkbox';
		chk.checked = !!todo.done;

		const span = document.createElement('span');
		span.textContent = todo.text;
		if (todo.done) span.classList.add('completed');

		chk.addEventListener('change', () => {
			const idx = findIndexById(todo.id);
			if (idx === -1) return;
			todos[idx].done = chk.checked;
			if (chk.checked) span.classList.add('completed'); else span.classList.remove('completed');
			save();
			updateCount();
		});

		const btnEdit = document.createElement('button');
		btnEdit.textContent = 'Editar';
		btnEdit.className = 'btn-edit';
		btnEdit.addEventListener('click', () => startEdit(todo.id, span));

		const btn = document.createElement('button');
		btn.textContent = 'Excluir';
		btn.className = 'btn-delete';
		btn.addEventListener('click', () => removeTodoWithAnimation(todo.id, li));

		left.appendChild(chk);
		left.appendChild(span);
		li.appendChild(left);

		const right = document.createElement('div');
		right.style.display = 'flex';
		right.style.alignItems = 'center';
		right.appendChild(btnEdit);
		right.appendChild(btn);
		li.appendChild(right);

		list.appendChild(li);
	}

	function startEdit(id, spanEl) {
		const idx = findIndexById(id);
		if (idx === -1) return;
		const current = todos[idx].text;
		const inputEdit = document.createElement('input');
		inputEdit.type = 'text';
		inputEdit.value = current;
		inputEdit.style.fontSize = '16px';
		inputEdit.style.padding = '6px 8px';
		inputEdit.style.borderRadius = '6px';
		inputEdit.style.border = '1px solid #e6eef8';
		spanEl.replaceWith(inputEdit);
		inputEdit.focus();

		function finish(saveText) {
			inputEdit.removeEventListener('blur', onBlur);
			inputEdit.removeEventListener('keydown', onKey);
			const text = (saveText ? inputEdit.value.trim() : current);
			todos[idx].text = text || current;
			save();
			render();
		}

		function onBlur() { finish(true); }
		function onKey(e) {
			if (e.key === 'Enter') finish(true);
			if (e.key === 'Escape') finish(false);
		}

		inputEdit.addEventListener('blur', onBlur);
		inputEdit.addEventListener('keydown', onKey);
	}

	function removeTodoWithAnimation(id, liEl) {
		liEl.classList.add('removing');
		setTimeout(() => {
			const idx = findIndexById(id);
			if (idx === -1) return;
			// store deleted for undo
			lastDeleted = { todo: todos[idx], index: idx };
			todos.splice(idx, 1);
			save();
			render();
			showUndoSnackbar();
		}, 260);
	}

	function showUndoSnackbar() {
		const snackbar = document.getElementById('undo-snackbar');
		const undoBtn = document.getElementById('undo-button');
		snackbar.classList.add('show');
		// clear existing timer if any
		if (undoTimer) clearTimeout(undoTimer);
		undoTimer = setTimeout(() => {
			snackbar.classList.remove('show');
			lastDeleted = null;
			undoTimer = null;
		}, 5000);

		function doUndo() {
			if (!lastDeleted) return;
			const { todo, index } = lastDeleted;
			// restore at previous index (or end if out of bounds)
			const pos = Math.min(Math.max(0, index), todos.length);
			todos.splice(pos, 0, todo);
			save();
			render();
			lastDeleted = null;
			snackbar.classList.remove('show');
			if (undoTimer) clearTimeout(undoTimer);
			undoTimer = null;
		}

		// attach one-time handler
		const onClick = () => {
			doUndo();
			undoBtn.removeEventListener('click', onClick);
		};
		undoBtn.addEventListener('click', onClick);
	}

	form.addEventListener('submit', e => {
		e.preventDefault();
		const text = input.value.trim();
		if (!text) return;
		const todo = { id: Date.now() + Math.random(), text, done: false };
		todos.push(todo);
		save();
		render();
		input.value = '';
		input.focus();
	});

	clearBtn.addEventListener('click', () => {
		if (!confirm('Deseja limpar todas as tarefas?')) return;
		// animate all then clear
		const items = Array.from(list.querySelectorAll('li'));
		items.forEach(li => li.classList.add('removing'));
		setTimeout(() => {
			todos = [];
			save();
			render();
		}, 260);
	});

	// filter buttons
	document.querySelectorAll('.filter-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentFilter = btn.dataset.filter || 'all';
			render();
		});
	});

	load();
	render();
});
