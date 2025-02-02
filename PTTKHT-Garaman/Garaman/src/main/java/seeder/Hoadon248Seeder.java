package seeder;

import dao.Hoadon248DAO;
import dao.NVKithuatHoadon248DAO;
import model.Hoadon248;
import model.NVKithuatHoadon248;
import utils.DateUtils;
import utils.Utils;

import java.sql.Timestamp;
import java.util.Date;

public class Hoadon248Seeder {
    public static void run() {
        for (int i = 0; i < 1000; ++i) {
            Hoadon248 hoadon248 = new Hoadon248();
            hoadon248.setKhachhang248id(1);
            hoadon248.setThoigian(DateUtils.getRandomTime(Timestamp.valueOf("2023-01-01 00:00:00").getTime(), new Date().getTime()));
            hoadon248.setTongtien(0);
            hoadon248.setTrangthai(0);
            hoadon248.setNVBanhang248id(3);
            Hoadon248DAO.instance().createOne(hoadon248);
            NVKithuatHoadon248 nvKithuatHoadon248 = new NVKithuatHoadon248();
            nvKithuatHoadon248.setHoadon248id(hoadon248.getId());
            nvKithuatHoadon248.setNhanvien248id(4);
            NVKithuatHoadon248DAO.instance().createOne(nvKithuatHoadon248);
            for (int j = 0; j < Utils.getRandInt(1, 3); ++j) {
                DichvuHoadon248Seeder.run(hoadon248.getId());
            }
            for (int j = 0; j < Utils.getRandInt(1, 3); ++j) {
                PhutungHoadon248Seeder.run(hoadon248.getId());
            }
        }
    }
}
