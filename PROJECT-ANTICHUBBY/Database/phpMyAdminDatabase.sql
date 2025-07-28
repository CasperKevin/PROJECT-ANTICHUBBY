-- Bảng NguoiDung
Use 
CREATE TABLE NguoiDung (
    maNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
    hoTen NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    matKhau NVARCHAR(255) NOT NULL,
    soDienThoai NVARCHAR(20),
    diaChi NVARCHAR(255),
    vaiTro NVARCHAR(10) DEFAULT 'Khach',
    ngayTao DATETIME DEFAULT GETDATE()
);

-- Bảng LoaiSanPham
CREATE TABLE LoaiSanPham (
    maLoai INT IDENTITY(1,1) PRIMARY KEY,
    tenLoai NVARCHAR(100) NOT NULL,
    moTa NVARCHAR(255)
);

-- Bảng ThuongHieu
CREATE TABLE ThuongHieu (
    maThuongHieu INT IDENTITY(1,1) PRIMARY KEY,
    tenThuongHieu NVARCHAR(100) NOT NULL,
    quocGia NVARCHAR(100)
);

-- Bảng SanPham
CREATE TABLE SanPham (
    maSanPham INT IDENTITY(1,1) PRIMARY KEY,
    tenSanPham NVARCHAR(255) NOT NULL,
    maLoaiSanPham INT NOT NULL,
    maThuongHieu INT NOT NULL,
    giaBan DECIMAL(10,2) NOT NULL,
    soLuong INT NOT NULL,
    hinhAnh NVARCHAR(255),
    moTa TEXT,
    ngayThem DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (maLoaiSanPham) REFERENCES LoaiSanPham(maLoai),
    FOREIGN KEY (maThuongHieu) REFERENCES ThuongHieu(maThuongHieu)
);

-- Bảng GioHang
CREATE TABLE GioHang (
    maGioHang INT IDENTITY(1,1) PRIMARY KEY,
    maNguoiDung INT NOT NULL,
    ngayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- Bảng ChiTietGioHang
CREATE TABLE ChiTietGioHang (
    maChiTiet INT IDENTITY(1,1) PRIMARY KEY,
    maGioHang INT NOT NULL,
    maSanPham INT NOT NULL,
    soLuong INT NOT NULL,
    gia DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (maGioHang) REFERENCES GioHang(maGioHang),
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
);

-- Bảng DonHang
CREATE TABLE DonHang (
    maDonHang INT IDENTITY(1,1) PRIMARY KEY,
    maNguoiDung INT NOT NULL,
    ngayDat DATETIME DEFAULT GETDATE(),
    tongTien DECIMAL(10,2) NOT NULL,
    diaChiGiao NVARCHAR(255),
    trangThai NVARCHAR(50) DEFAULT 'Cho xu ly',
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- Bảng ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    maChiTiet INT IDENTITY(1,1) PRIMARY KEY,
    maDonHang INT NOT NULL,
    maSanPham INT NOT NULL,
    soLuong INT NOT NULL,
    gia DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (maDonHang) REFERENCES DonHang(maDonHang),
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
);

-- Bảng DanhGia
CREATE TABLE DanhGia (
    maDanhGia INT IDENTITY(1,1) PRIMARY KEY,
    maNguoiDung INT NOT NULL,
    maSanPham INT NOT NULL,
    soSao INT,
    binhLuan NVARCHAR(500),
    ngayDanhGia DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung),
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
);

CREATE TABLE Admin (
    maAdmin INT IDENTITY(1,1) PRIMARY KEY,
    hoTen NVARCHAR(100) NOT NULL,
    tenDangNhap NVARCHAR(50) NOT NULL UNIQUE,
    matKhau NVARCHAR(255) NOT NULL,
    email NVARCHAR(100) UNIQUE,
    soDienThoai NVARCHAR(20),
    capBac NVARCHAR(20) DEFAULT 'QuanLy',
    ngayTao DATETIME DEFAULT GETDATE()
);



-- DELIMITER //

CREATE TRIGGER check_sosao_before_insert
BEFORE INSERT ON DanhGia
FOR EACH ROW
BEGIN
    IF NEW.soSao < 1 OR NEW.soSao > 5 THEN
        THROW 50000,
        SET MESSAGE_TEXT = 'SoSao phải nằm trong khoảng từ 1 đến 5!';
    END IF;
END;
//

DELIMITER ;


-- DELIMITER //

CREATE TRIGGER check_sosao_before_update
BEFORE UPDATE ON DanhGia
FOR EACH ROW
BEGIN
    IF NEW.soSao < 1 OR NEW.soSao > 5 THEN
        THROW 50000,
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
(N'MG Vidar 1/100', 2, 1, 1500000, 10, N'vidar-mg.jpg', N'MG của Gundam Vidar từ Iron-Blooded Orphans'),
(N'RG HI-V 1/144', 3, 1, 1300000, 10, N'hi-v-rg.jpg', N'Real Grade của Hi-V Gundam từ Char''s Counterattack'),
(N'RG Wing Gundam 1/144', 3, 1, 700000, 15, N'wing-rg.jpg', N'Gundam cổ điển từ series Wing'),
(N'HG Barbatos 1/144', 1, 1, 300000, 10, N'barbatos-hg.jpg', N'Mẫu HG của Gundam Barbatos từ Iron-Blooded Orphans'),
(N'RG Unicorn Gundam 1/144', 3, 1, 1800000, 10, N'unicorn-rg.jpg', N'Phiên bản RG chuyển dạng từ Unicorn'),
(N'PG Strike Gundam 1/60', 4, 1, 6000000, 5, N'strike-pg.jpg', N'Phiên bản PG tỉ lệ 1/60 của Strike'),
(N'PG Unicorn Gundam 1/60', 4, 1, 6500000, 5, N'unicorn-pg-v2.jpg', N'PG Unicorn bản mới full armor'),
(N'RG Wing Gundam Zero EW', 3, 1, 700000, 10, N'wing-zero-ew-rg.jpg', N'Phiên bản RG rẻ hơn, từ Endless Waltz'),
(N'MG Barbatos 1/100', 2, 1, 1350000, 10, N'barbatos-mg.jpg', N'MG chi tiết cao từ Iron-Blooded Orphans'),
(N'RG 1/144 Miku Hatsune''s Zaku II', 3, 1, 1000000, 8, N'zaku-miku.jpg', N'Zaku II phiên bản đặc biệt Hatsune Miku'),
(N'MG NT-1 Alex 1/100', 2, 1, 1350000, 10, N'nt1-alex-mg.jpg', N'MG Gundam NT-1 Alex từ series War in the Pocket, thiết kế mạnh mẽ và chi tiết cao'),
(N'HG STTS-808 Immortal Justice Gundam 1/144', 1, 1, 300000, 10, N'immortal-justice-hg.jpg', N'Mẫu HG của Immortal Justice Gundam từ Cosmic Era, tỉ lệ 1/144, thiết kế đẹp và hiện đại'),
(N'RG Epyon 1/144', 3, 1, 1300000, 10, N'epyon-rg.jpg', N'RG Epyon đến từ series Gundam Wing với thiết kế đỏ mạnh mẽ, biến đổi dạng rồng'),
(N'RG Nu Gundam 1/144', 3, 1, 1200000, 10, N'nu-gundam-rg.jpg', N'Mẫu RG của Nu Gundam với fin funnel đẹp mắt, đến từ Char''s Counterattack'),
(N'MG Exia 1/100', 2, 1, 1100000, 10, N'exia-mg.jpg', N'MG Exia từ Gundam 00, khớp nối linh hoạt và GN Sword đặc trưng'),
(N'HG Calibarn 1/144', 1, 1, 450000, 10, N'calibarn-hg.jpg', N'Mẫu HG đến từ series Witch from Mercury, thiết kế mới và độc đáo');

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



-- Thêm sản phẩm mới

INSERT INTO SanPham (tenSanPham, maLoaiSanPham, maThuongHieu, giaBan, soLuong, hinhAnh, moTa) VALUES
(N'MG Vidar 1/100', 2, 1, 1500000, 10, N'vidar-mg.jpg', N'MG của Gundam Vidar từ Iron-Blooded Orphans'),
(N'RG HI-V 1/144', 3, 1, 1300000, 10, N'hi-v-rg.jpg', N'Real Grade của Hi-V Gundam từ Char''s Counterattack'),
(N'RG Wing Gundam 1/144', 3, 1, 700000, 15, N'wing-rg.jpg', N'Gundam cổ điển từ series Wing'),
(N'RG Unicorn Gundam 1/144', 3, 1, 1800000, 10, N'unicorn-rg.jpg', N'Phiên bản RG chuyển dạng từ Unicorn'),
(N'PG Strike Gundam 1/60', 4, 1, 6000000, 5, N'strike-pg.jpg', N'Phiên bản PG tỉ lệ 1/60 của Strike'),
(N'PG Unicorn Gundam 1/60', 4, 1, 6500000, 5, N'unicorn-pg-v2.jpg', N'PG Unicorn bản mới full armor'),
(N'RG Wing Gundam Zero EW', 3, 1, 700000, 10, N'wing-zero-ew-rg.jpg', N'Phiên bản RG rẻ hơn, từ Endless Waltz'),
(N'MG Barbatos 1/100', 2, 1, 1350000, 10, N'barbatos-mg.jpg', N'MG chi tiết cao từ Iron-Blooded Orphans'),
(N'RG 1/144 Miku Hatsune''s Zaku II', 3, 1, 1000000, 8, N'zaku-miku.jpg', N'Zaku II phiên bản đặc biệt Hatsune Miku');
