function showContextMenu(x, y, fileName, fileType) {
  hideContextMenu();
  const menu = document.createElement('div');
  menu.id = 'contextMenu';
  menu.className = 'fixed bg-github-canvas-overlay border border-github-border-default rounded-lg shadow-2xl py-2 z-50 min-w-[160px]';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.innerHTML = window.templates.contextMenu.buildMenu(fileName, fileType);
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) menu.style.left = `${x - rect.width}px`;
  if (rect.bottom > window.innerHeight) menu.style.top = `${y - rect.height}px`;
}

function hideContextMenu() {
  const menu = document.getElementById('contextMenu');
  if (menu) menu.remove();
}

function showCreateRepoModal() {
  document.getElementById('createRepoModal').classList.remove('hidden');
  document.getElementById('createRepoModal').classList.add('flex');
  document.getElementById('newRepoName').focus();
}

function hideCreateRepoModal() {
  document.getElementById('createRepoModal').classList.add('hidden');
  document.getElementById('createRepoModal').classList.remove('flex');
  document.getElementById('newRepoName').value = '';
  document.getElementById('repoDescriptionInput').value = '';
  document.getElementById('visibilityPublic').checked = true;
  document.getElementById('initReadme').checked = true;
}

function showCreateFileModal() {
  document.getElementById('createFileModal').classList.remove('hidden');
  document.getElementById('createFileModal').classList.add('flex');
  document.getElementById('currentPathPrefix').textContent = currentState.repository + (currentState.path ? '/' + currentState.path : '') + '/';
  document.getElementById('newFileName').focus();
}

function hideCreateFileModal() {
  document.getElementById('createFileModal').classList.add('hidden');
  document.getElementById('createFileModal').classList.remove('flex');
  document.getElementById('newFileName').value = '';
  document.getElementById('fileCategoryInput').value = '';
  document.getElementById('tagInput').value = '';
  if (initialContentEditor) initialContentEditor.setValue('');
  currentState.selectedTags = [];
  updateSelectedTags();
}

function showDeleteFileModal() {
  if (!currentState.currentFile) return;
  document.getElementById('fileToDeleteName').textContent = currentState.currentFile.name;
  document.getElementById('deleteFileModal').classList.remove('hidden');
  document.getElementById('deleteFileModal').classList.add('flex');
}

function hideDeleteFileModal() {
  document.getElementById('deleteFileModal').classList.add('hidden');
  document.getElementById('deleteFileModal').classList.remove('flex');
}


function showSuccessMessage(message) {
  LoadingProgress.show();
  const notification = document.createElement('div');
  notification.innerHTML = window.templates.notifications.success(message);
  const notificationElement = notification.firstElementChild;
  document.body.appendChild(notificationElement);
  setTimeout(() => {
    LoadingProgress.hide();
    notificationElement.style.animation = 'fadeOut 0.3s ease-in';
    setTimeout(() => notificationElement.parentNode?.removeChild(notificationElement), 300);
  }, 3000);
}

function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.innerHTML = window.templates.notifications.error(message);
  const notificationElement = notification.firstElementChild;
  notificationElement.dataset.notify = 'error';
  document.body.appendChild(notificationElement);
  setTimeout(() => {
    notificationElement.style.animation = 'fadeOut 0.5s ease-in';
    setTimeout(() => notificationElement.parentNode?.removeChild(notificationElement), 300);
  }, 5000);
}
/**
 * 
 *  C R E A T E D  B Y
 * 
 *  William Hanson 
 * 
 *  Chevrolay@Outlook.com
 * 
 *  m.me/Chevrolay
 * 
 */