<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:main title="Đặt lịch hẹn" js="/js/gdDatlichhen.js">
    <jsp:body>
        <div class="bg-gray-50 dark:bg-gray-900 h-full">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
                <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Đặt lịch hẹn
                        </h1>
                        <form class="space-y-4 md:space-y-6" action="/datlichhen" method="post">
                            <input name="success" value="${success}" hidden="">
                            <div>
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Họ
                                    và tên</label>
                                <input type="text" name="ten" id="name"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Nguyễn Văn A" value="${sessionScope.get("user").getTen()}"
                                       required="">
                            </div>
                            <div>
                                <label for="phoneNumber"
                                       class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện
                                    thoại</label>
                                <input type="tel" name="dt" id="phoneNumber"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="0123456789" value="0${sessionScope.get("user").getDt()}" required="">
                            </div>
                            <div>
                                <label for="time" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thời
                                    gian</label>
                                <input type="datetime-local" name="thoigian" id="time"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="name@company.com" required="">
                            </div>
                            <button type="submit"
                                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Tạo mới
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </jsp:body>
</t:main>