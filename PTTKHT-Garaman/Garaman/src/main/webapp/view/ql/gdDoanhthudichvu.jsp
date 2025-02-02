<%@ page import="response.DoanhthuRes" %>
<%@ page import="java.util.List" %>
<%@ page import="response.Doanhthu" %>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
    DoanhthuRes doanhthuRes = (DoanhthuRes) request.getAttribute("doanhthuRes");
    List<Doanhthu> doanhthuList = doanhthuRes.getDoanhthuList();
    int pageNumber = doanhthuRes.getPageNumber();
    int pageSize = 10;
    String prevPage = "#";
    String nextPage = "#";
    if (pageNumber > 1) {
        prevPage = "?page=" + (pageNumber - 1);
    }
    if (doanhthuList.size() == pageSize) {
        nextPage = "?page=" + (pageNumber + 1);
    }
    request.setAttribute("doanhthuList", doanhthuList);
    request.setAttribute("prevPage", prevPage);
    request.setAttribute("nextPage", nextPage);
    request.setAttribute("pageNumber", pageNumber);
    request.setAttribute("pageSize", pageSize);
%>

<t:main title="Doanh thu dịch vụ" role="QL" js="/js/gdDoanhthudichvu.js">
    <jsp:body>
        <div class="w-fit min-w-[50%] mx-auto mb-5">
            <p class="flex items-center mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
                Doanh thu dịch vụ
            </p>

            <div date-rangepicker class="flex items-center my-5">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                    <input name="start" type="text"
                           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Select date start">
                </div>
                <span class="mx-4 text-gray-500">to</span>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                    <input name="end" type="text"
                           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Select date end">
                </div>
                <button type="button" class="xem-TK text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-5 ">Xem</button>
            </div>

            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="w-1 px-6 py-3">
                        STT
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Mã dịch vụ
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Tên dịch vụ
                    </th>
                    <th scope="col" class="px-6 py-3 text-right">
                        Doanh thu
                    </th>
                </tr>
                </thead>
                <tbody>
                <c:if test="${doanhthuList.size() - 1 >= 0}">
                    <c:forEach var="i" begin="0" end="${doanhthuList.size() - 1}">
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row"
                                class="w-1 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <a href="/dichvusudung?id=${doanhthuList.get(i).getId()}">${(pageSize * (pageNumber - 1)) + i + 1}</a>
                            </th>
                            <td class="px-6 py-4">
                                <a href="/dichvusudung?id=${doanhthuList.get(i).getId()}">DV${doanhthuList.get(i).getId()}</a>
                            </td>
                            <td class="px-6 py-4">
                                <a href="/dichvusudung?id=${doanhthuList.get(i).getId()}">${doanhthuList.get(i).getTen()}</a>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a href="/dichvusudung?id=${doanhthuList.get(i).getId()}">${doanhthuList.get(i).getDoanhthu()}</a>
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

