INSERT INTO Thanhvien248 (taikhoan, matkhau, ten, diachi, email, dt)
VALUES ('user', '1234', 'Lê Minh Hiếu', 'Hà Nội', 'hieu@gmail.com', '0123456789');

INSERT INTO Khachhang248 (Thanhvien248id)
VALUES (LAST_INSERT_ID());

INSERT INTO Thanhvien248 (taikhoan, matkhau, ten, diachi, email, dt)
VALUES ('admin', '1234', 'Nguyễn Văn A', 'Hà Nội', 'a@gmail.com', '0123456789');

INSERT INTO Nhanvien248 (Thanhvien248id, vitri)
VALUES (LAST_INSERT_ID(), 'QL');

INSERT INTO Thanhvien248 (taikhoan, matkhau, ten, diachi, email, dt)
VALUES ('sale', '1234', 'Nguyễn Văn B', 'Hà Nội', 'b@gmail.com', '0123456789');

INSERT INTO Nhanvien248 (Thanhvien248id, vitri)
VALUES (LAST_INSERT_ID(), 'BH');

INSERT INTO Thanhvien248 (taikhoan, matkhau, ten, diachi, email, dt)
VALUES ('engineer', '1234', 'Nguyễn Văn C', 'Hà Nội', 'c@gmail.com', '0123456789');

INSERT INTO Nhanvien248 (Thanhvien248id, vitri)
VALUES (LAST_INSERT_ID(), 'KT');

INSERT INTO Phutung248 (ten, gia, soluong)
VALUES
    ('Bảo vệ heo dầu', 55000, 0),
    ('Bộ mỏ đuôi mạ crom', 90000, 0),
    ('Che pô Gang loại dày', 165000, 0),
    ('Che pô lớn mạ crom', 160000, 0),
    ('Che pô nhỏ inox', 95000, 0),
    ('Che pô nhỏ mạ crom', 130000, 0),
    ('Chỉ mũi mặt nạ mạ crom', 160000, 0),
    ('Chụp đuôi pô', 50000, 0),
    ('Cóc phuộc inox', 70000, 0),
    ('Cóc phuộc mạ crom', 80000, 0),
    ('Đèn lái mạ crom', 110000, 0),
    ('Đuôi đèn mạ crom', 90000, 0),
    ('Gác chân nhỏ inox', 60000, 0),
    ('Gác chân nhỏ mạ crom', 105000, 0),
    ('Kèn xi nhan made in Japan', 85000, 0),
    ('Khóa Chip thông minh Gosu (3 chip)', 1150000, 0),
    ('Khóa chống bằng điện thoại', 2600000, 0),
    ('Khóa chống trộm bằng remote', 490000, 0),
    ('Khoá đĩa trước chính hãng Z-con', 250000, 0),
    ('Khoá mâm sau chính hãng Z-con', 290000, 0),
    ('Lốc máy lớn inox', 135000, 0),
    ('Lốc máy lớn mạ crom', 200000, 0),
    ('Lốc máy nhỏ inox', 95000, 0),
    ('Lốc máy nhỏ mạ crom', 150000, 0),
    ('Mặt nạ kiểu SH Ý', 450000, 0),
    ('Mặt nạ lớn mạ crom', 180000, 0),
    ('Mỏ đuôi vè inox', 50000, 0),
    ('Nẹp lốc máy mạ crom', 130000, 0),
    ('Nẹp sườn giống SH Ý', 250000, 0),
    ('Ốp cản sau mạ crom', 230000, 0),
    ('Ốp phuộc trước mạ crom', 150000, 0),
    ('Pô e inox', 90000, 0),
    ('Pô e mạ crom', 120000, 0),
    ('Quạt gió inox', 90000, 0),
    ('Quạt gió mạ crom', 120000, 0),
    ('Sò lốc máy inox', 70000, 0),
    ('Sò lốc máy mạ crom', 110000, 0),
    ('Thảm để chân cao su', 50000, 0),
    ('Thảm để chân inox', 135000, 0),
    ('Thảm để chân mạ crom', 250000, 0),
    ('Thăm nhớt biker', 180000, 0),
    ('Ty chặn nắp nhớt', 25000, 0),
    ('Vỏ phuộc sau inox', 150000, 0),
    ('Xi nhan trước mạ crom', 90000, 0);


INSERT INTO Dichvu248 (ten, gia)
VALUES ('Vệ sinh nồi', 150000),
       ('Vệ sinh họng', 100000),
       ('Thay nhông sên dĩa', 280000),
       ('Vỏ xe máy', 250000),
       ('Làm nồi xe máy', 500000),
       ('Phục hồi động cơ honda', 2000000),
       ('Thay dàn áo xe máy', 500000),
       ('Thay bugi', 60000),
       ('Thay dây công tơ mét', 60000),
       ('Thay dây ga', 60000),
       ('Công nắn càng, thay dầu giảm xóc xe máy', 150000),
       ('Công láng đĩa phanh xe máy', 120000),
       ('Công láng cổ góp bộ đề', 60000),
       ('Công đóng bạc đề, láng cổ góp', 80000),
       ('Công bảo dưỡng xích đề xe máy', 30000),
       ('Công mở đầu quy lát, nắp xi lanh', 160000),
       ('Công mở bộ ly hợp (côn)', 100000),
       ('Công bổ máy (sửa động cơ)', 250000),
       ('Công sửa chữa hệ thống báo xăng', 35000),
       ('Công thay bơm dầu', 150000),
       ('Công thay xích cam', 150000),
       ('Công thay bi bánh sau', 80000),
       ('Công thay bi bánh trước', 20000),
       ('Công thay còi', 20000),
       ('Công thay cuộn phát điện', 300000),
       ('Công thay dây và bảo dưỡng tay ga', 35000),
       ('Thay dây le', 25000),
       ('Thay dây phanh', 25000),
       ('Công thay ống xả', 20000),
       ('Công thay nhông xích và bảo dưỡng má phanh sau', 40000),
       ('Công vệ sinh lọc gió', 20000),
       ('Hàn cổ bô', 50000),
       ('Quấn dây bơm xăng', 100000),
       ('Công vệ sinh kim phun (xe phun xăng điện tử)', 60000),
       ('Vệ sinh buồng đốt động cơ', 80000);


DELETE FROM Thanhvien248;
ALTER TABLE Thanhvien248 AUTO_INCREMENT = 1;

DELETE FROM Nhanvien248;
DELETE FROM Khachhang248;

DELETE FROM PhutungHoadon248;
ALTER TABLE PhutungHoadon248 AUTO_INCREMENT = 1;

DELETE FROM DichvuHoadon248;
ALTER TABLE DichvuHoadon248 AUTO_INCREMENT = 1;

DELETE FROM NVKithuatHoadon248;

DELETE FROM Hoadon248;
ALTER TABLE Hoadon248 AUTO_INCREMENT = 1;

DELETE FROM Phutung248;
ALTER TABLE Phutung248 AUTO_INCREMENT = 1;

DELETE FROM Dichvu248;
ALTER TABLE Dichvu248 AUTO_INCREMENT = 1;
