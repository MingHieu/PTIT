package response;

import lombok.Data;

import java.util.List;

@Data
public class DichvuHoadonRes {
    List<DichvuHoadon248Res> dichvuHoadon248List;
    int pageNumber;
    boolean end;
}
