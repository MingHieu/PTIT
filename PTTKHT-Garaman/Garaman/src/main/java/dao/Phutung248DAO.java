package dao;

import model.PhutungHoadon248;
import response.Doanhthu;
import response.DoanhthuRes;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Phutung248DAO {
    static Phutung248DAO shared = null;

    public static Phutung248DAO instance() {
        if (shared == null) {
            shared = new Phutung248DAO();
        }
        return shared;
    }

    public DoanhthuRes getDoanhThu(int pageNumber, Timestamp from, Timestamp to) {
        String sql = "SELECT * FROM Phutung248 LIMIT ? OFFSET ?";
        DoanhthuRes doanhthuRes = new DoanhthuRes();
        List<Doanhthu> doanhthuList = new ArrayList<>();
        int pageSize = 10;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setInt(1, pageSize);
            preparedStatement.setInt(2, (pageNumber - 1) * pageSize);

            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                Doanhthu doanhthu = new Doanhthu();
                doanhthu.setId(resultSet.getLong("id"));
                doanhthu.setTen(resultSet.getString("ten"));
                List<PhutungHoadon248> phutungHoadon248List = PhutungHoadon248DAO.instance().findMany(resultSet.getLong("id"), from, to);
                for (PhutungHoadon248 phutungHoadon248 : phutungHoadon248List) {
                    doanhthu.setDoanhthu(doanhthu.getDoanhthu() + phutungHoadon248.getGia() * phutungHoadon248.getSoluong());
                }
                doanhthuList.add(doanhthu);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        doanhthuRes.setDoanhthuList(doanhthuList);
        doanhthuRes.setEnd(doanhthuRes.getDoanhthuList().size() < pageSize);
        return doanhthuRes;
    }
}
