package response;

import lombok.Data;

import java.util.List;

@Data
public class PhutungHoadonRes {
    List<PhutungHoadon248Res> phutungHoadon248List;
    int pageNumber;
    boolean end;
}
