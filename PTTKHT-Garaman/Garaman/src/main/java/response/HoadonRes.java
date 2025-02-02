package response;

import lombok.Data;
import model.Khachhang248;
import model.Nhanvien248;

import java.sql.Timestamp;
import java.util.List;

@Data
public class HoadonRes {
    long id;
    Timestamp thoigian;
    long tongtien;
    Khachhang248 khachhang248;
    Nhanvien248 nvBanhang248;
    List<Nhanvien248> nvKithuat248List;
    List<DichvuHoadon248Res> dichvu248List;
    List<PhutungHoadon248Res> phutung248List;
}
