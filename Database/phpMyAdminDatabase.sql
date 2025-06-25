-- Bảng NguoiDung
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
('Unicorn Gundam PG', 4, 1, 3500000, 5, 'unicorn-pg.jpg', 'Phiên bản PG chuyển đổi Destroy Mode');
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

