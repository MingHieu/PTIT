package dao;

import model.DichvuHoadon248;
import response.DichvuHoadon248Res;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DichvuHoadon248DAO {
    static DichvuHoadon248DAO shared = null;

    public static DichvuHoadon248DAO instance() {
        if (shared == null) {
            shared = new DichvuHoadon248DAO();
        }
        return shared;
    }

    public int createOne(DichvuHoadon248 dichvuHoadon248) {
        String sql1 = "select * from Dichvu248 where id = ?";
        String sql2 = "insert into DichvuHoadon248" + " (Dichvu248id, Hoadon248id, soluong, gia) values " + "(?, ?, ?, ?);";
        String sql3 = "UPDATE Hoadon248 SET tongtien = tongtien + ? WHERE id = ?";
        int result = 0;
        long gia = 0;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement ps1 = conn.prepareStatement(sql1);
            ps1.setLong(1, dichvuHoadon248.getDichvu248id());
            ResultSet rs = ps1.executeQuery();
            if (rs.next()) {
                PreparedStatement ps2 = conn.prepareStatement(sql2);
                ps2.setLong(1, dichvuHoadon248.getDichvu248id());
                ps2.setLong(2, dichvuHoadon248.getHoadon248id());
                ps2.setInt(3, dichvuHoadon248.getSoluong());
                gia = rs.getLong("gia");
                ps2.setLong(4, gia);
                result = ps2.executeUpdate();
            }
            if (result == 0) {
                throw new SQLException("Creating failed, no rows affected.");
            }
            PreparedStatement ps3 = conn.prepareStatement(sql3);
            ps3.setLong(1, dichvuHoadon248.getSoluong() * gia);
            ps3.setLong(2, dichvuHoadon248.getHoadon248id());
            ps3.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public List<DichvuHoadon248> findMany(long id, Timestamp from, Timestamp to) {
        String sql = "SELECT * FROM DichvuHoadon248 dh " +
                "JOIN Hoadon248 hd ON dh.Hoadon248id = hd.id " +
                "WHERE dh.Dichvu248id = ? AND hd.thoigian >= ? AND hd.thoigian <= ? ";
        List<DichvuHoadon248> dichvuHoadon248List = new ArrayList<>();

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, id);
            preparedStatement.setTimestamp(2, from);
            preparedStatement.setTimestamp(3, to);

            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                DichvuHoadon248 dichvuHoadon248 = new DichvuHoadon248();
                dichvuHoadon248.setHoadon248id(resultSet.getInt("Dichvu248id"));
                dichvuHoadon248.setHoadon248id(resultSet.getInt("Hoadon248id"));
                dichvuHoadon248.setSoluong(resultSet.getInt("soluong"));
                dichvuHoadon248.setGia(resultSet.getLong("gia"));
                dichvuHoadon248List.add(dichvuHoadon248);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return dichvuHoadon248List;
    }

    public List<DichvuHoadon248Res> findMany(long id, Timestamp from, Timestamp to, int pageNumber) {
        String sql = "SELECT dh.*, hd.thoigian AS hoadon_thoigian, dv.ten as dichvu_ten FROM DichvuHoadon248 dh " +
                "JOIN Hoadon248 hd ON dh.Hoadon248id = hd.id " +
                "JOIN Dichvu248 dv ON dh.Dichvu248id = dv.id " +
                "WHERE dh.Dichvu248id = ? AND hd.thoigian >= ? AND hd.thoigian <= ? " +
                "ORDER BY hd.thoigian DESC " +
                "LIMIT ? OFFSET ?";
        List<DichvuHoadon248Res> dichvuHoadon248List = new ArrayList<>();
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
                DichvuHoadon248Res dichvuHoadon248 = new DichvuHoadon248Res();
                dichvuHoadon248.setTen(resultSet.getString("dichvu_ten"));
                dichvuHoadon248.setSoluong(resultSet.getInt("soluong"));
                dichvuHoadon248.setHoadon248id(resultSet.getLong("Hoadon248id"));
                dichvuHoadon248.setHoadonThoigian(resultSet.getTimestamp("hoadon_thoigian"));
                dichvuHoadon248List.add(dichvuHoadon248);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return dichvuHoadon248List;
    }
}
