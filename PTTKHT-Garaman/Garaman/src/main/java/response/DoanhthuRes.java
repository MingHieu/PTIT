package response;

import lombok.Data;

import java.util.List;

@Data
public class DoanhthuRes {
    List<Doanhthu> doanhthuList;
    int pageNumber;
    boolean end;
}

