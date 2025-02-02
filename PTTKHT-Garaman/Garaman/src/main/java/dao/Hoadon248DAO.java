package dao;

import model.Hoadon248;
import model.Khachhang248;
import model.Nhanvien248;
import response.DichvuHoadon248Res;
import response.HoadonRes;
import response.PhutungHoadon248Res;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Hoadon248DAO {
    static Hoadon248DAO shared = null;

    public static Hoadon248DAO instance() {
        if (shared == null) {
            shared = new Hoadon248DAO();
        }
        return shared;
    }

    public int createOne(Hoadon248 hoadon248) {
        String sql = "insert into Hoadon248" + " (Khachhang248id,  NVbanhang248id, thoigian, tongtien, trangthai) values " + "(?, ?, ?, ?, ?);";
        int result = 0;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setLong(1, hoadon248.getKhachhang248id());
            preparedStatement.setLong(2, hoadon248.getNVBanhang248id());
            preparedStatement.setTimestamp(3, hoadon248.getThoigian());
            preparedStatement.setLong(4, hoadon248.getTongtien());
            preparedStatement.setInt(5, hoadon248.getTrangthai());
            result = preparedStatement.executeUpdate();

            if (result == 0) {
                throw new SQLException("Creating failed, no rows affected.");
            }

            try (ResultSet generatedKeys = preparedStatement.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    hoadon248.setId(generatedKeys.getLong(1));
                } else {
                    throw new SQLException("Creating failed, no ID obtained.");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public HoadonRes findOne(long id) {
        String sql1 = "SELECT hd.*, kh.*, nv.* FROM Hoadon248 hd " +
                "JOIN Thanhvien248 kh ON kh.id = hd.Khachhang248id " +
                "JOIN Thanhvien248 nv ON nv.id = hd.NVBanhang248id " +
                "WHERE hd.id = ?";
        String sql2 = "SELECT ph.*, pt.* FROM Hoadon248 hd " +
                "JOIN PhutungHoadon248 ph ON ph.Hoadon248id = hd.id " +
                "JOIN Phutung248 pt ON ph.Phutung248id = pt.id " +
                "WHERE hd.id = ?";
        String sql3 = "SELECT dh.*, dv.* FROM Hoadon248 hd " +
                "JOIN DichvuHoadon248 dh ON dh.Hoadon248id = hd.id " +
                "JOIN Dichvu248 dv ON dh.Dichvu248id = dv.id " +
                "WHERE hd.id = ?";
        String sql4 = "SELECT nh.*, nv.* FROM Hoadon248 hd " +
                "JOIN NVKithuatHoadon248 nh ON nh.Hoadon248id = hd.id " +
                "JOIN Thanhvien248 nv ON nv.id = nh.NVKithuat248id " +
                "WHERE hd.id = ?";
        HoadonRes hoadonRes = new HoadonRes();

        List<PhutungHoadon248Res> phutung248List = new ArrayList<>();
        List<DichvuHoadon248Res> dichvu248List = new ArrayList<>();
        List<Nhanvien248> nvKithuat248List = new ArrayList<>();

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement ps1 = conn.prepareStatement(sql1);
            ps1.setLong(1, id);
            ResultSet rs1 = ps1.executeQuery();
            if (rs1.next()) {
                hoadonRes.setId(id);
                hoadonRes.setThoigian(rs1.getTimestamp("thoigian"));
                hoadonRes.setTongtien(rs1.getLong("tongtien"));

                Khachhang248 khachhang248 = new Khachhang248();
                khachhang248.setThanhvien248id(rs1.getLong("kh.id"));
                khachhang248.setId(rs1.getLong("kh.id"));
                khachhang248.setTaikhoan(rs1.getString("kh.taikhoan"));
                khachhang248.setTen(rs1.getString("kh.ten"));
                khachhang248.setDiachi(rs1.getString("kh.diachi"));
                khachhang248.setEmail(rs1.getString("kh.email"));
                khachhang248.setDt(rs1.getString("kh.dt"));
                hoadonRes.setKhachhang248(khachhang248);

                Nhanvien248 nhanvien248 = new Nhanvien248();
                nhanvien248.setId(rs1.getLong("nv.id"));
                nhanvien248.setTen(rs1.getString("nv.ten"));
                hoadonRes.setNvBanhang248(nhanvien248);
            }

            PreparedStatement ps2 = conn.prepareStatement(sql2);
            ps2.setLong(1, id);
            ResultSet rs2 = ps2.executeQuery();
            while (rs2.next()) {
                PhutungHoadon248Res phutungHoadon248Res = new PhutungHoadon248Res();
                phutungHoadon248Res.setTen(rs2.getString("ten"));
                phutungHoadon248Res.setSoluong(rs2.getInt("ph.soluong"));
                phutungHoadon248Res.setGia(rs2.getInt("ph.gia"));
                phutung248List.add(phutungHoadon248Res);
            }

            PreparedStatement ps3 = conn.prepareStatement(sql3);
            ps3.setLong(1, id);
            ResultSet rs3 = ps3.executeQuery();
            while (rs3.next()) {
                DichvuHoadon248Res dichvuHoadon248Res = new DichvuHoadon248Res();
                dichvuHoadon248Res.setTen(rs3.getString("ten"));
                dichvuHoadon248Res.setSoluong(rs3.getInt("soluong"));
                dichvuHoadon248Res.setGia(rs3.getInt("dh.gia"));
                dichvu248List.add(dichvuHoadon248Res);
            }

            PreparedStatement ps4 = conn.prepareStatement(sql4);
            ps4.setLong(1, id);
            ResultSet rs4 = ps4.executeQuery();
            while (rs4.next()) {
                Nhanvien248 nhanvien248 = new Nhanvien248();
                nhanvien248.setId(rs4.getLong("id"));
                nhanvien248.setTen(rs4.getString("ten"));
                nvKithuat248List.add(nhanvien248);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        hoadonRes.setPhutung248List(phutung248List);
        hoadonRes.setDichvu248List(dichvu248List);
        hoadonRes.setNvKithuat248List(nvKithuat248List);
        return hoadonRes;
    }
}
