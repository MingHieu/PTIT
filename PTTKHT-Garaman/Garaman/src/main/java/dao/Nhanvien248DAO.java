package dao;

import model.Nhanvien248;
import model.Thanhvien248;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Nhanvien248DAO {
    static Nhanvien248DAO shared = null;

    public static Nhanvien248DAO instance() {
        if (shared == null) {
            shared = new Nhanvien248DAO();
        }
        return shared;
    }

    public int createOne(Nhanvien248 user) {
        String sql = "insert into Nhanvien248" + " (Thanhvien248id) values " + "(?);";
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

    public Nhanvien248 findOne(Thanhvien248 thanhvien) {
        String sql = "select * from Nhanvien248 where Thanhvien248id = ?";
        Nhanvien248 user = null;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, thanhvien.getId());
            ResultSet rs = preparedStatement.executeQuery();
            if (rs.next()) {
                user = new Nhanvien248();
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
