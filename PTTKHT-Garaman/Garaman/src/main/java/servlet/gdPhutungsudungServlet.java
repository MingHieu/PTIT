package servlet;

import dao.PhutungHoadon248DAO;
import response.PhutungHoadon248Res;
import response.PhutungHoadonRes;
import utils.DateUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;


@WebServlet("/phutungsudung")

public class gdPhutungsudungServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idReq = req.getParameter("id");
        String pageReq = req.getParameter("page");
        String fromReq = req.getParameter("from");
        String toReq = req.getParameter("to");
        long id = idReq != null ? Long.parseLong(idReq) : 1;
        int pageNumber = pageReq != null ? Integer.parseInt(pageReq) : 1;
        Timestamp from = fromReq != null ? new Timestamp(Long.parseLong(fromReq)) : DateUtils.getStartTimeOfCurrentDay();
        Timestamp to = toReq != null ? new Timestamp(Long.parseLong(toReq)) : DateUtils.getCurrentTime();
        int pageSize = 10;

        List<PhutungHoadon248Res> phutungHoadon248List = PhutungHoadon248DAO.instance().findMany(id, from, to, pageNumber);
        PhutungHoadonRes phutungHoadonRes = new PhutungHoadonRes();
        phutungHoadonRes.setPhutungHoadon248List(phutungHoadon248List);
        phutungHoadonRes.setPageNumber(pageNumber);
        phutungHoadonRes.setEnd(phutungHoadon248List.size() < pageSize);

        req.setAttribute("phutungHoadonRes", phutungHoadonRes);
        req.getRequestDispatcher("/view/ql/gdPhutungsudung.jsp").forward(req, resp);
    }
}