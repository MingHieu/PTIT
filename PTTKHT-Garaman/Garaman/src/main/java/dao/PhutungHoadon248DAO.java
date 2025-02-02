package dao;

import model.PhutungHoadon248;
import response.PhutungHoadon248Res;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PhutungHoadon248DAO {
    static PhutungHoadon248DAO shared = null;

    public static PhutungHoadon248DAO instance() {
        if (shared == null) {
            shared = new PhutungHoadon248DAO();
        }
        return shared;
    }

    public int createOne(PhutungHoadon248 phutungHoadon248) {
        String sql1 = "select * from Phutung248 where id = ?";
        String sql2 = "insert into PhutungHoadon248" + " (Phutung248id, Hoadon248id, soluong, gia) values " + "(?, ?, ?, ?);";
        String sql3 = "UPDATE Hoadon248 SET tongtien = tongtien + ? WHERE id = ?";
        int result = 0;
        long gia = 0;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement ps1 = conn.prepareStatement(sql1);
            ps1.setLong(1, phutungHoadon248.getPhutung248id());
            ResultSet rs = ps1.executeQuery();
            if (rs.next()) {
                PreparedStatement ps2 = conn.prepareStatement(sql2);
                ps2.setLong(1, phutungHoadon248.getPhutung248id());
                ps2.setLong(2, phutungHoadon248.getHoadon248id());
                ps2.setInt(3, phutungHoadon248.getSoluong());
                gia = rs.getLong("gia");
                ps2.setLong(4, gia);
                result = ps2.executeUpdate();
            }
            if (result == 0) {
                throw new SQLException("Creating failed, no rows affected.");
            }
            PreparedStatement ps3 = conn.prepareStatement(sql3);
            ps3.setLong(1, phutungHoadon248.getSoluong() * gia);
            ps3.setLong(2, phutungHoadon248.getHoadon248id());
            ps3.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public List<PhutungHoadon248> findMany(long id, Timestamp from, Timestamp to) {
        String sql = "SELECT * FROM PhutungHoadon248 ph " +
                "JOIN Hoadon248 hd ON ph.Hoadon248id = hd.id " +
                "WHERE ph.Phutung248id = ? AND hd.thoigian >= ? AND hd.thoigian <= ? ";
        List<PhutungHoadon248> phutungHoadon248List = new ArrayList<>();

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, id);
            preparedStatement.setTimestamp(2, from);
            preparedStatement.setTimestamp(3, to);

            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                PhutungHoadon248 phutungHoadon248 = new PhutungHoadon248();
                phutungHoadon248.setPhutung248id(resultSet.getInt("Phutung248id"));
                phutungHoadon248.setHoadon248id(resultSet.getInt("Hoadon248id"));
                phutungHoadon248.setSoluong(resultSet.getInt("soluong"));
                phutungHoadon248.setGia(resultSet.getLong("gia"));
                phutungHoadon248List.add(phutungHoadon248);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return phutungHoadon248List;
    }

    public List<PhutungHoadon248Res> findMany(long id, Timestamp from, Timestamp to, int pageNumber) {
        String sql = "SELECT ph.*, hd.thoigian AS hoadon_thoigian, pt.ten AS phutung_ten FROM PhutungHoadon248 ph " +
                "JOIN Hoadon248 hd ON ph.Hoadon248id = hd.id " +
                "JOIN Phutung248 pt ON ph.Phutung248id = pt.id " +
                "WHERE ph.Phutung248id = ? AND hd.thoigian >= ? AND hd.thoigian <= ? " +
                "ORDER BY hd.thoigian DESC " +
                "LIMIT ? OFFSET ?";
        List<PhutungHoadon248Res> phutungHoadon248List = new ArrayList<>();
        int pageSize = 10;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, id);
            preparedStatement.setTimestamp(2, from);
            preparedStatement.setTimestamp(3, to);
            preparedStatement.setInt(4, pageSize);
            preparedStatement.setInt(5, (pageNumber - 1) * pageSize);

            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                PhutungHoadon248Res phutungHoadon248 = new PhutungHoadon248Res();
                phutungHoadon248.setTen(resultSet.getString("phutung_ten"));
                phutungHoadon248.setSoluong(resultSet.getInt("soluong"));
                phutungHoadon248.setHoadon248id(resultSet.getLong("Hoadon248id"));
                phutungHoadon248.setHoadonThoigian(resultSet.getTimestamp("hoadon_thoigian"));
                phutungHoadon248List.add(phutungHoadon248);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return phutungHoadon248List;
    }
}