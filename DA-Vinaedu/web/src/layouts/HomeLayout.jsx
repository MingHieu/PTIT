import { AiOutlineMenu } from 'solid-icons/ai';

function HomeLayout(props) {
  return (
    <>
      <nav class="bg-[rgba(255,255,255,.8)] fixed w-full z-20 backdrop-blur-sm">
        <div class="max-w-screen-2xl xl:w-[90%] mx-auto p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="w-full md:w-auto flex justify-between items-center">
            <a href="/" class="flex items-center space-x-3">
              <h1 class="text-3xl font-bold text-blue-600">VinaEdu</h1>
            </a>
            <div>
              <label
                for="dropdown"
                class="inline-flex items-center p-2 w-10 h-10 text-gray-500 rounded-lg md:hidden hover:bg-gray-100">
                <AiOutlineMenu size={24} />
              </label>
              <input id="dropdown" type="checkbox" class="appearance-none" />
            </div>
          </div>
          <div class="nav-bar flex-1 justify-between md:pl-5 md:flex md:items-center md:space-x-8 overflow-hidden">
            <ul class="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
              <li>
                <a
                  href="/#features"
                  class="py-2 px-3 text-xl font-semibold md:text-base text-gray-500 hover:text-blue-700 transition duration-300">
                  Tính năng
                </a>
              </li>
              <li>
                <a
                  href="/#feedback"
                  class="py-2 px-3 text-xl font-semibold md:text-base text-gray-500 hover:text-blue-700 transition duration-300">
                  Đánh giá
                </a>
              </li>
              {/* <li>
                <a
                  href="#pricing"
                  class="py-2 px-3 text-xl font-semibold md:text-base text-gray-500 hover:text-blue-700 transition duration-300">
                  Bảng giá
                </a>
              </li> */}
              <li>
                <a
                  href="/#contact"
                  class="py-2 px-3 text-xl font-semibold md:text-base text-gray-500 hover:text-blue-700 transition duration-300">
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  class="py-2 px-3 text-xl font-semibold md:text-base text-gray-500 hover:text-blue-700 transition duration-300">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
            <a
              href="/login"
              class="block w-full md:w-auto mt-4 md:mt-0 text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2">
              Bắt đầu miễn phí
            </a>
          </div>
        </div>
      </nav>
      {props.children}
      <footer class="bg-gray-800 text-gray-200 py-8">
        <div class="max-w-screen-xl mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
              <h3 class="text-2xl font-semibold">VinaEdu</h3>
              <p class="mt-2 text-gray-400">
                Nâng cao việc học thông qua công nghệ.
              </p>
            </div>

            <div class="flex space-x-6">
              <a href="/#features" class="hover:text-white">
                Tính năng
              </a>
              <a href="/#feedback" class="hover:text-white">
                Đánh giá
              </a>
              {/* <a href="#pricing" class="hover:text-white">
                Bảng giá
              </a> */}
              <a href="/#contact" class="hover:text-white">
                Liên hệ
              </a>
              <a href="/privacy-policy" class="hover:text-white">
                Chính sách bảo mật
              </a>
            </div>
          </div>

          <div class="mt-8 border-t border-gray-700 pt-6 text-center md:text-left">
            <p class="text-gray-400">© 2024 VinaEdu. Mọi quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomeLayout;
