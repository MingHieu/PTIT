package dao;

import model.DichvuHoadon248;
import response.Doanhthu;
import response.DoanhthuRes;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Dichvu248DAO {
    static Dichvu248DAO shared = null;

    public static Dichvu248DAO instance() {
        if (shared == null) {
            shared = new Dichvu248DAO();
        }
        return shared;
    }

    public DoanhthuRes getDoanhThu(int pageNumber, Timestamp from, Timestamp to) {
        String sql = "SELECT * FROM Dichvu248 LIMIT ? OFFSET ?";
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
                List<DichvuHoadon248> dichvuHoadon248List = DichvuHoadon248DAO.instance().findMany(resultSet.getLong("id"), from, to);
                for (DichvuHoadon248 dichvuHoadon248 : dichvuHoadon248List) {
                    doanhthu.setDoanhthu(doanhthu.getDoanhthu() + dichvuHoadon248.getGia() * dichvuHoadon248.getSoluong());
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
