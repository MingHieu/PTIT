package dao;

import model.Hoadon248;
import model.Lichhen248;

import java.sql.*;

public class Lichhen248DAO {
    static Lichhen248DAO shared = null;

    public static Lichhen248DAO instance() {
        if (shared == null) {
            shared = new Lichhen248DAO();
        }
        return shared;
    }

    public int createOne(Lichhen248 lichhen248) {
        String sql = "insert into Lichhen248" + " (Khachhang248id, ten, dt, thoigian, trangthai) values " + "(?, ?, ?, ?, ?);";
        int result = 0;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setLong(1, lichhen248.getKhachhang248id());
            preparedStatement.setString(2, lichhen248.getTen());
            preparedStatement.setString(3, lichhen248.getDt());
            preparedStatement.setTimestamp(4, lichhen248.getThoigian());
            preparedStatement.setInt(5, lichhen248.getTrangthai());
            result = preparedStatement.executeUpdate();

            if (result == 0) {
                throw new SQLException("Creating failed, no rows affected.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }
}
