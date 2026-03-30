document.addEventListener('DOMContentLoaded', () => {
    const userPhoto = document.getElementById('userPhoto');
    const userDropdown = document.getElementById('userDropdown');
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    // Profile එක click කරාම dropdown එක පෙන්වන්න/අයින් කරන්න
    userPhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });

    // පිටත click කරොත් dropdown එක වහන්න
    window.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
    });

    // Logout function එක (No Notifications)
    logoutBtn.addEventListener('click', () => {
        // 1. Storage එකේ දත්ත තියෙනවා නම් ඒවා අයින් කරන්න (Optional)
        localStorage.removeItem('userToken');
        sessionStorage.clear();

        // 2. UI එක වෙනස් කරන්න
        userInfo.classList.add('hidden');
        userDropdown.classList.add('hidden'); // Dropdown එකත් වහන්න
        loginBtn.classList.remove('hidden');

        // 3. අවශ්‍ය නම් වෙනත් පිටුවකට (Home) යොමු කරන්න
        // window.location.href = 'index.html';
    });
});




