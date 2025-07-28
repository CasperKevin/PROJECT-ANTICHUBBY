-- Bảng NguoiDung
Use 
CREATE TABLE NguoiDung (
    maNguoiDung INT AUTO_INCREMENT PRIMARY KEY,
    hoTen VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    soDienThoai VARCHAR(20),
    diaChi VARCHAR(255),
    vaiTro VARCHAR(10) DEFAULT 'Khach',
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng LoaiSanPham
CREATE TABLE LoaiSanPham (
    maLoai INT AUTO_INCREMENT PRIMARY KEY,
    tenLoai VARCHAR(100) NOT NULL,
    moTa VARCHAR(255)
);

-- Bảng ThuongHieu
CREATE TABLE ThuongHieu (
    maThuongHieu INT AUTO_INCREMENT PRIMARY KEY,
    tenThuongHieu VARCHAR(100) NOT NULL,
    quocGia VARCHAR(100)
);

-- Bảng SanPham
CREATE TABLE SanPham (
    maSanPham INT AUTO_INCREMENT PRIMARY KEY,
    tenSanPham VARCHAR(255) NOT NULL,
    maLoaiSanPham INT NOT NULL,
    maThuongHieu INT NOT NULL,
    giaBan DECIMAL(10,2) NOT NULL,
    soLuong INT NOT NULL,
    hinhAnh VARCHAR(255),
    moTa TEXT,
    ngayThem DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maLoaiSanPham) REFERENCES LoaiSanPham(maLoai),
    FOREIGN KEY (maThuongHieu) REFERENCES ThuongHieu(maThuongHieu)
);

-- Bảng GioHang
CREATE TABLE GioHang (
    maGioHang INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- Bảng ChiTietGioHang
CREATE TABLE ChiTietGioHang (
    maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    maGioHang INT NOT NULL,
    maSanPham INT NOT NULL,
    soLuong INT NOT NULL,
    gia DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (maGioHang) REFERENCES GioHang(maGioHang),
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
);

-- Bảng DonHang
CREATE TABLE DonHang (
    maDonHang INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL,
    ngayDat DATETIME DEFAULT CURRENT_TIMESTAMP,
    tongTien DECIMAL(10,2) NOT NULL,
    diaChiGiao VARCHAR(255),
    trangThai VARCHAR(50) DEFAULT 'Cho xu ly',
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- Bảng ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    maDonHang INT NOT NULL,
    maSanPham INT NOT NULL,
    soLuong INT NOT NULL,
    gia DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (maDonHang) REFERENCES DonHang(maDonHang),
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
);

-- Bảng DanhGia
CREATE TABLE DanhGia (
    maDanhGia INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL,
    maSanPham INT NOT NULL,
    soSao INT,
    binhLuan VARCHAR(500),
    ngayDanhGia DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung),
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
);

CREATE TABLE Admin (
    maAdmin INT AUTO_INCREMENT PRIMARY KEY,
    hoTen VARCHAR(100) NOT NULL,
    tenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    soDienThoai VARCHAR(20),
    capBac VARCHAR(20) DEFAULT 'QuanLy',
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);



DELIMITER //

CREATE TRIGGER check_sosao_before_insert
BEFORE INSERT ON DanhGia
FOR EACH ROW
BEGIN
    IF NEW.soSao < 1 OR NEW.soSao > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SoSao phải nằm trong khoảng từ 1 đến 5!';
    END IF;
END;
//

DELIMITER ;


DELIMITER //

CREATE TRIGGER check_sosao_before_update
BEFORE UPDATE ON DanhGia
FOR EACH ROW
BEGIN
    IF NEW.soSao < 1 OR NEW.soSao > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SoSao phải nằm trong khoảng từ 1 đến 5!';
    END IF;
END;
//

DELIMITER ;


INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, vaiTro)
VALUES 
('Nguyễn Văn A', 'a@gmail.com', '123456', '0909123456', 'TP.HCM', 'Admin'),
('Lê Thị B', 'b@gmail.com', 'abcdef', '0911223344', 'Hà Nội', 'Khach'),
('Trần Minh C', 'c@gmail.com', 'qwerty', '0988112233', 'Đà Nẵng', 'Khach');
INSERT INTO LoaiSanPham (tenLoai, moTa)
VALUES 
('HG (High Grade)', 'Mô hình đơn giản, tỷ lệ 1/144'),
('MG (Master Grade)', 'Chi tiết cao, tỷ lệ 1/100'),
('RG (Real Grade)', 'Kết hợp giữa HG và MG'),
('PG (Perfect Grade)', 'Cao cấp, tỷ lệ 1/60');
INSERT INTO ThuongHieu (tenThuongHieu, quocGia)
VALUES 
('Bandai', 'Nhật Bản'),
('Kotobukiya', 'Nhật Bản'),
('Daban', 'Trung Quốc');
INSERT INTO SanPham (tenSanPham, maLoaiSanPham, maThuongHieu, giaBan, soLuong, hinhAnh, moTa)
VALUES 
('RX-78-2 Gundam HG', 1, 1, 350000, 20, 'rx78-hg.jpg', 'Phiên bản HG của Gundam huyền thoại'),
('Freedom Gundam MG', 2, 1, 850000, 15, 'freedom-mg.jpg', 'Freedom Gundam với chi tiết cực cao'),
('Strike Freedom RG', 3, 1, 980000, 10, 'strike-rg.jpg', 'Phiên bản RG sắc sảo và chi tiết'),
('Unicorn Gundam PG', 4, 1, 3500000, 5, 'unicorn-pg.jpg', 'Phiên bản PG chuyển đổi Destroy Mode'),
('Wing Gundam Zero HG', 1, 1, 380000, 18, 'wing-zero-hg.jpg', 'Phiên bản HG của Wing Gundam Zero với cánh đẹp'),
('Zaku II HG', 1, 1, 320000, 25, 'zaku-hg.jpg', 'Mobile suit cổ điển của Zeon'),
('Barbatos Lupus HG', 1, 1, 400000, 15, 'barbatos-hg.jpg', 'Gundam từ series Iron-Blooded Orphans'),
('Nu Gundam MG', 2, 1, 950000, 12, 'nu-gundam-mg.jpg', 'Phiên bản MG với fin funnel chi tiết'),
('Sazabi MG', 2, 1, 1100000, 8, 'sazabi-mg.jpg', 'Mobile suit khổng lồ của Char Aznable'),
('Strike Gundam MG', 2, 1, 880000, 10, 'strike-mg.jpg', 'Gundam chính từ SEED với nhiều vũ khí'),
('Exia RG', 3, 1, 1020000, 9, 'exia-rg.jpg', 'RG với khớp nối linh hoạt và chi tiết GN Drive'),
('Zaku II RG', 3, 1, 920000, 12, 'zaku-rg.jpg', 'Phiên bản RG của mobile suit huyền thoại'),
('Tallgeese RG', 3, 1, 980000, 7, 'tallgeese-rg.jpg', 'Mobile suit mạnh mẽ từ Wing'),
('Astray Red Frame PG', 4, 1, 3800000, 4, 'astray-pg.jpg', 'PG với thanh kiếm khổng lồ và khung xương chi tiết'),
('Gundam Mk-II HG', 1, 1, 360000, 20, 'mk2-hg.jpg', 'Phiên bản HG của Gundam Mk-II từ Zeta'),
('Gouf Custom HG', 1, 1, 340000, 15, 'gouf-hg.jpg', 'Mobile suit đặc biệt với heat rod'),
('Death Scythe HG', 1, 1, 370000, 12, 'deathscythe-hg.jpg', 'Gundam với lưỡi hái tử thần từ Wing'),
('Heavyarms MG', 2, 1, 900000, 8, 'heavyarms-mg.jpg', 'MG với nhiều vũ khí và đạn dược'),
('Sandrock MG', 2, 1, 870000, 7, 'sandrock-mg.jpg', 'Gundam sa mạc từ series Wing'),
('Sinaju MG', 2, 1, 1200000, 6, 'sinaju-mg.jpg', 'Mobile suit đỏ của Full Frontal'),
('Wing Gundam Zero RG', 3, 1, 1050000, 5, 'wing-zero-rg.jpg', 'Phiên bản RG với cánh thiên thần'),
('Gundam GP01 RG', 3, 1, 950000, 8, 'gp01-rg.jpg', 'Gundam từ 0083 Stardust Memory'),
('Banshee PG', 4, 1, 3700000, 3, 'banshee-pg.jpg', 'Phiên bản PG của Banshee với Destroy Mode'),
('Strike Freedom PG', 4, 1, 4000000, 2, 'strike-freedom-pg.jpg', 'Phiên bản PG với hệ thống DRAGOON');
-- Giỏ hàng
INSERT INTO GioHang (maNguoiDung)
VALUES (2), (3);

-- Chi tiết giỏ hàng
INSERT INTO ChiTietGioHang (maGioHang, maSanPham, soLuong, gia)
VALUES 
(1, 1, 2, 350000),
(1, 2, 1, 850000),
(2, 3, 1, 980000);
-- Đơn hàng
INSERT INTO DonHang (maNguoiDung, tongTien, diaChiGiao)
VALUES 
(2, 1550000, 'Hà Nội - Quận Đống Đa'),
(3, 980000, 'Đà Nẵng - Hải Châu');

-- Chi tiết đơn hàng
INSERT INTO ChiTietDonHang (maDonHang, maSanPham, soLuong, gia)
VALUES 
(1, 1, 2, 350000),
(1, 2, 1, 850000),
(2, 3, 1, 980000);
INSERT INTO DanhGia (maNguoiDung, maSanPham, soSao, binhLuan)
VALUES 
(2, 1, 5, 'Rất đáng tiền, chi tiết tốt'),
(3, 3, 4, 'Đẹp nhưng lắp hơi khó'),
(2, 2, 5, 'Tuyệt vời, đáng mua');
INSERT INTO Admin (hoTen, tenDangNhap, matKhau, email, soDienThoai, capBac)
VALUES 
('Nguyễn Thành Đạt', 'admin_gundam', 'admin123', 'admin@gundamshop.vn', '0909555111', 'SuperAdmin'),
('Lê Hồng Phúc', 'quanly_phuc', 'phuc321', 'phuc@gundamshop.vn', '0933444555', 'QuanLy');

