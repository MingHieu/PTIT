package response;

import lombok.Data;

import java.sql.Timestamp;

@Data

public class DichvuHoadon248Res {
    String ten;
    int soluong;
    long gia;
    long hoadon248id;
    Timestamp hoadonThoigian;
}
