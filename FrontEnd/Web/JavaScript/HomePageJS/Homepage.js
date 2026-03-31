document.addEventListener('DOMContentLoaded', () => {
    const userPhoto = document.getElementById('userPhoto');
    const userDropdown = document.getElementById('userDropdown');
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    userPhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });

    window.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userToken');
        sessionStorage.clear();

        userInfo.classList.add('hidden');
        userDropdown.classList.add('hidden');
        loginBtn.classList.remove('hidden');

        // window.location.href = 'index.html';
    });
});




