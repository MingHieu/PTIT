package dao;

import model.Khachhang248;
import model.Thanhvien248;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Khachhang248DAO {
    static Khachhang248DAO shared = null;

    public static Khachhang248DAO instance() {
        if (shared == null) {
            shared = new Khachhang248DAO();
        }
        return shared;
    }

    public int createOne(Khachhang248 user) {
        String sql = "insert into Khachhang248" + " (Thanhvien248id) values " + "(?);";
        int result = 0;

        try {
            Thanhvien248DAO.instance().createOne(user);
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, user.getId());
            result = preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public Khachhang248 findOne(Thanhvien248 thanhvien) {
        String sql = "select * from Khachhang248 where Thanhvien248id = ?";
        Khachhang248 user = null;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, thanhvien.getId());
            ResultSet rs = preparedStatement.executeQuery();
            if (rs.next()) {
                user = new Khachhang248();
                user.setId(thanhvien.getId());
                user.setTaikhoan(thanhvien.getTaikhoan());
                user.setMatkhau(thanhvien.getMatkhau());
                user.setTen(thanhvien.getTen());
                user.setDiachi(thanhvien.getDiachi());
                user.setEmail(thanhvien.getEmail());
                user.setDt(thanhvien.getDt());
                user.setGhichu(thanhvien.getGhichu());
                user.setThanhvien248id(thanhvien.getId());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return user;
    }
}
