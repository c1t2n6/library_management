// Điều hướng các tab
const navLinks = document.querySelectorAll('.sidebar nav ul li a');
const sections = document.querySelectorAll('.section');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const id = this.id.replace('nav-', '') + '-section';
        sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    });
});

// Hàm fetch dữ liệu dashboard
async function fetchDashboardStats() {
    // Gọi API lấy số lượng sách, người dùng, lượt mượn
    const [books, users, borrows] = await Promise.all([
        fetch('/book/').then(r => r.json()),
        fetch('/user/').then(r => r.json()),
        fetch('/borrow/').then(r => r.json()).catch(() => []) // fallback nếu chưa có endpoint
    ]);
    document.getElementById('stat-books').textContent = books.length;
    document.getElementById('stat-users').textContent = users.length;
    document.getElementById('stat-borrows').textContent = borrows.length || 0;
}

fetchDashboardStats();

// --- Quản lý Sách ---
async function fetchAndRenderBooks() {
    const section = document.getElementById('books-section');
    section.innerHTML = `
        <h2>Quản lý Sách</h2>
        <button id="add-book-btn">+ Thêm sách mới</button>
        <div id="add-book-form" style="display:none; margin: 24px 0;">
            <h3>Thêm sách mới</h3>
            <form id="book-form">
                <input type="text" name="title" placeholder="Tên sách" required />
                <input type="text" name="author" placeholder="Tác giả" required />
                <input type="text" name="isbn" placeholder="ISBN" required />
                <input type="number" name="publish_year" placeholder="Năm xuất bản" required />
                <label><input type="checkbox" name="available" checked /> Có sẵn</label>
                <button type="submit">Lưu</button>
            </form>
        </div>
        <table class="book-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>ISBN</th>
                    <th>Năm XB</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody id="book-list">
                <tr><td colspan="6">Đang tải...</td></tr>
            </tbody>
        </table>
    `;
    document.getElementById('add-book-btn').onclick = () => {
        const form = document.getElementById('add-book-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById('book-form').onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            title: formData.get('title'),
            author: formData.get('author'),
            isbn: formData.get('isbn'),
            publish_year: Number(formData.get('publish_year')),
            available: formData.get('available') === 'on'
        };
        const res = await fetch('/book/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Thêm sách thành công!');
            this.reset();
            document.getElementById('add-book-form').style.display = 'none';
            fetchAndRenderBooks();
        } else {
            alert('Có lỗi khi thêm sách!');
        }
    };
    const res = await fetch('/book/');
    const books = await res.json();
    const list = document.getElementById('book-list');
    if (books.length === 0) {
        list.innerHTML = '<tr><td colspan="6">Chưa có sách nào.</td></tr>';
        return;
    }
    list.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.publish_year}</td>
            <td>${book.available ? 'Có sẵn' : 'Đã mượn'}</td>
        </tr>
    `).join('');
}

// Gọi khi chuyển tab
const booksNav = document.getElementById('nav-books');
booksNav.addEventListener('click', fetchAndRenderBooks);

// --- Quản lý Người dùng ---
async function fetchAndRenderUsers() {
    const section = document.getElementById('users-section');
    section.innerHTML = `
        <h2>Quản lý Người dùng</h2>
        <button id="add-user-btn">+ Thêm người dùng</button>
        <div id="add-user-form" style="display:none; margin: 24px 0;">
            <h3>Thêm người dùng mới</h3>
            <form id="user-form">
                <input type="text" name="full_name" placeholder="Họ tên" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="text" name="phone" placeholder="Số điện thoại" required />
                <button type="submit">Lưu</button>
            </form>
        </div>
        <table class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                </tr>
            </thead>
            <tbody id="user-list">
                <tr><td colspan="4">Đang tải...</td></tr>
            </tbody>
        </table>
    `;
    document.getElementById('add-user-btn').onclick = () => {
        const form = document.getElementById('add-user-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById('user-form').onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };
        const res = await fetch('/user/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Thêm người dùng thành công!');
            this.reset();
            document.getElementById('add-user-form').style.display = 'none';
            fetchAndRenderUsers();
        } else {
            alert('Có lỗi khi thêm người dùng!');
        }
    };
    const res = await fetch('/user/');
    const users = await res.json();
    const list = document.getElementById('user-list');
    if (users.length === 0) {
        list.innerHTML = '<tr><td colspan="4">Chưa có người dùng nào.</td></tr>';
        return;
    }
    list.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
        </tr>
    `).join('');
}

const usersNav = document.getElementById('nav-users');
usersNav.addEventListener('click', fetchAndRenderUsers);

// --- Quản lý Mượn/Trả ---
async function fetchAndRenderBorrows() {
    const section = document.getElementById('borrows-section');
    section.innerHTML = `
        <h2>Quản lý Mượn/Trả</h2>
        <button id="add-borrow-btn">+ Mượn sách mới</button>
        <div id="add-borrow-form" style="display:none; margin: 24px 0;">
            <h3>Mượn sách mới</h3>
            <form id="borrow-form">
                <select name="user_id" required><option value="">-- Chọn người dùng --</option></select>
                <select name="book_id" required><option value="">-- Chọn sách có sẵn --</option></select>
                <input type="date" name="borrow_date" required />
                <button type="submit">Mượn</button>
            </form>
        </div>
        <table class="borrow-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Người dùng</th>
                    <th>Sách</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody id="borrow-list">
                <tr><td colspan="7">Đang tải...</td></tr>
            </tbody>
        </table>
    `;
    document.getElementById('add-borrow-btn').onclick = () => {
        const form = document.getElementById('add-borrow-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    };
    // Load user và book cho form
    const [users, books] = await Promise.all([
        fetch('/user/').then(r => r.json()),
        fetch('/book/').then(r => r.json())
    ]);
    const userSelect = document.querySelector('#borrow-form select[name="user_id"]');
    users.forEach(u => userSelect.innerHTML += `<option value="${u.id}">${u.full_name}</option>`);
    const bookSelect = document.querySelector('#borrow-form select[name="book_id"]');
    books.filter(b => b.available).forEach(b => bookSelect.innerHTML += `<option value="${b.id}">${b.title}</option>`);
    document.getElementById('borrow-form').onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            user_id: Number(formData.get('user_id')),
            book_id: Number(formData.get('book_id')),
            borrow_date: formData.get('borrow_date')
        };
        const res = await fetch('/borrow/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Mượn sách thành công!');
            this.reset();
            document.getElementById('add-borrow-form').style.display = 'none';
            fetchAndRenderBorrows();
        } else {
            alert('Có lỗi khi mượn sách!');
        }
    };
    // Hiển thị danh sách mượn/trả
    const res = await fetch('/borrow/');
    const borrows = await res.json();
    const borrowList = document.getElementById('borrow-list');
    if (!borrows.length) {
        borrowList.innerHTML = '<tr><td colspan="7">Chưa có lượt mượn nào.</td></tr>';
        return;
    }
    // Map id sang tên
    const userMap = Object.fromEntries(users.map(u => [u.id, u.full_name]));
    const bookMap = Object.fromEntries(books.map(b => [b.id, b.title]));
    borrowList.innerHTML = borrows.map(borrow => `
        <tr>
            <td>${borrow.id}</td>
            <td>${userMap[borrow.user_id] || borrow.user_id}</td>
            <td>${bookMap[borrow.book_id] || borrow.book_id}</td>
            <td>${borrow.borrow_date}</td>
            <td>${borrow.return_date || '-'}</td>
            <td>${borrow.status === 'returned' ? 'Đã trả' : 'Đang mượn'}</td>
            <td>
                ${borrow.status === 'borrowed' ? `<button class="return-btn" data-id="${borrow.id}">Trả sách</button>` : ''}
            </td>
        </tr>
    `).join('');
    // Xử lý trả sách
    document.querySelectorAll('.return-btn').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            const return_date = prompt('Nhập ngày trả (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
            if (!return_date) return;
            const res = await fetch('/borrow/return', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id), return_date })
            });
            if (res.ok) {
                alert('Trả sách thành công!');
                fetchAndRenderBorrows();
            } else {
                alert('Có lỗi khi trả sách!');
            }
        };
    });
}

const borrowsNav = document.getElementById('nav-borrows');
borrowsNav.addEventListener('click', fetchAndRenderBorrows); 