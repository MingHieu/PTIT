<%@ page import="response.PhutungHoadonRes" %>
<%@ page import="model.PhutungHoadon248" %>
<%@ page import="java.util.List" %>
<%@ page import="response.PhutungHoadon248Res" %>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
    PhutungHoadonRes phutungHoadonRes = (PhutungHoadonRes) request.getAttribute("phutungHoadonRes");
    List<PhutungHoadon248Res> phutungHoadon248List = phutungHoadonRes.getPhutungHoadon248List();
    int pageNumber = phutungHoadonRes.getPageNumber();
    int pageSize = 10;
    String prevPage = "#";
    String nextPage = "#";
    if (pageNumber > 1) {
        prevPage = "?page=" + (pageNumber - 1);
    }
    if (phutungHoadon248List.size() == pageSize) {
        nextPage = "?page=" + (pageNumber + 1);
    }
    request.setAttribute("phutungHoadon248List", phutungHoadon248List);
    request.setAttribute("prevPage", prevPage);
    request.setAttribute("nextPage", nextPage);
    request.setAttribute("pageNumber", pageNumber);
    request.setAttribute("pageSize", pageSize);
%>

<t:main title="Phụ tùng sử dụng" role="QL" js="/js/gdPhutungsudung.js">
    <jsp:body>
        <div class="w-fit min-w-[50%] mx-auto mb-5">
            <a href="javascript:history.back()"
               class="flex items-center py-2 pr-4 pl-3 text-primary-700  lg:p-0 dark:text-white">
                <svg class="w-5 h-5 mr-2 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
                </svg>
                <span>Quay lại</span>
            </a>
            <p class="flex items-center my-10 text-2xl font-semibold text-gray-900 dark:text-white">
                Lịch sử
                <c:if test="${phutungHoadon248List.size() - 1 >= 0}">: ${phutungHoadon248List.get(0).getTen()}
                </c:if>
            </p>
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="w-1 px-6 py-3">
                        STT
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Mã hoá đơn
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Số lượng
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Thời gian
                    </th>
                </tr>
                </thead>
                <tbody>
                <c:if test="${phutungHoadon248List.size() - 1 >= 0}">
                    <c:forEach var="i" begin="0" end="${phutungHoadon248List.size() - 1}">
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row"
                                class="w-1 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <a href="/hoadon?id=${phutungHoadon248List.get(i).getHoadon248id()}">${(pageSize * (pageNumber - 1)) + i + 1}</a>
                            </th>
                            <td class="px-6 py-4">
                                <a href="/hoadon?id=${phutungHoadon248List.get(i).getHoadon248id()}">HD${phutungHoadon248List.get(i).getHoadon248id()}</a>
                            </td>
                            <td class="px-6 py-4">
                                <a href="/hoadon?id=${phutungHoadon248List.get(i).getHoadon248id()}">${phutungHoadon248List.get(i).getSoluong()}</a>
                            </td>
                            <td class="px-6 py-4">
                                <a href="/hoadon?id=${phutungHoadon248List.get(i).getHoadon248id()}">${phutungHoadon248List.get(i).getHoadonThoigian()}</a>
                            </td>
                        </tr>
                    </c:forEach>
                </c:if>
                </tbody>
            </table>
            <div class="flex flex-col items-center mt-5">
                <div class="inline-flex mt-2 xs:mt-0">
                    <a href="${prevPage}"
                       class="prevPage flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 5H1m0 0 4 4M1 5l4-4"/>
                        </svg>
                        Prev
                    </a>
                    <a href="${nextPage}"
                       class="nextPage flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Next
                        <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </jsp:body>
</t:main>

