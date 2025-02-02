import { faker } from '@faker-js/faker';
import { AiFillLock, AiOutlineCheck } from 'solid-icons/ai';
import { BiRegularSupport, BiRegularWorld } from 'solid-icons/bi';
import { BsBook } from 'solid-icons/bs';
import { FaSolidUsersRectangle } from 'solid-icons/fa';
import { VsCalendar } from 'solid-icons/vs';

const FEEDBACKS = [
  {
    name: faker.person.fullName(),
    position: 'Học sinh',
    feedback:
      '“Học trực tuyến chưa bao giờ dễ dàng hơn thế. Nền tảng này đã cách mạng hóa cách chúng ta học tập.”',
    image: faker.image.avatar(),
  },
  {
    name: faker.person.fullName(),
    position: 'Giáo viên',
    feedback:
      '“Sự tích hợp với Zoom và quản lý bài tập rất liền mạch và hiệu quả cao.”',
    image: faker.image.avatar(),
  },
  {
    name: faker.person.fullName(),
    position: 'Hiệu trưởng',
    feedback:
      '“Tương lai của giáo dục trực tuyến đã ở đây. Nền tảng này cung cấp mọi thứ cần thiết cho việc học trực tuyến hiệu quả.”',
    image: faker.image.avatar(),
  },
];

const PRICING_PLANS = [
  {
    name: 'Gói Miễn Phí',
    description: 'Hoàn hảo cho cá nhân và học sinh.',
    price: {
      amount: 0,
      currency: '$',
      frequency: 'tháng',
    },
    link: {
      text: 'Bắt đầu miễn phí',
      href: '#',
    },
    features: [
      'Chỉ 1 Lớp Học',
      'Tích hợp Zoom SDK',
      'Quản lý Bài tập, Bài kiểm tra, Tài liệu Học tập',
    ],
  },
  {
    name: 'Gói Cao Cấp',
    description: 'Phù hợp nhất cho giáo viên và các tổ chức.',
    price: {
      amount: 49,
      currency: '$',
      frequency: 'tháng',
    },
    link: {
      text: 'Nâng cấp Cao Cấp',
      href: '#',
    },
    features: [
      'Bao gồm Tính năng của Gói Miễn Phí',
      'Tối đa 10 Lớp Học',
      'Công cụ Quản lý Học sinh Nâng cao',
      'Hỗ trợ Tăng cường',
    ],
  },
  {
    name: 'Gói Trung Tâm Học Tập',
    description: 'Thiết kế cho các trường học và trung tâm học tập.',
    link: {
      text: 'Liên hệ với chúng tôi',
      href: '#',
    },
    price: null,
    features: [
      'Bao gồm Tính năng của Gói Cao Cấp',
      'Không giới hạn Lớp Học',
      'Phân tích Hiệu suất',
      'Tích hợp với Hệ thống của Trường',
    ],
  },
];

const Pricing = ({ plan: { name, description, price, link, features } }) => {
  return (
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 class="text-2xl font-semibold mb-4">{name}</h3>
      <p class="text-gray-500">{description}</p>
      <div class="flex justify-center items-baseline my-8">
        {price ? (
          <>
            <span class="text-5xl font-extrabold">
              {price.currency}
              {price.amount}
            </span>
            <span class="text-gray-500">/{price.frequency}</span>
          </>
        ) : (
          <span class="text-3xl font-extrabold">Contact for price</span>
        )}
      </div>
      <a href={link.href} class="bg-blue-600 text-white px-5 py-3 rounded-lg">
        {link.text}
      </a>
      <ul class="mt-8 space-y-4">
        {features.map(feature => (
          <li class="flex items-start">
            <AiOutlineCheck color="#22c55e" class="mt-[3px]" />
            <div class="flex-1">{feature}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Home = () => {
  return (
    <main class="pt-20 lg:pt-0">
      <section class="max-w-screen-xl h-[95vh] min-h-[724px] mx-auto flex flex-wrap items-center px-4">
        <div class="lg:w-1/2">
          <h1 class="text-6xl font-bold mb-4">
            <span class="bg-clip-text text-transparent bg-gradient-to-r leading-tight from-blue-400 to-blue-600">
              Đơn giản hóa việc <br />
              học trực tuyến
            </span>
          </h1>
          <p class="text-xl text-gray-500 my-8 leading-relaxed">
            Tham gia lớp học trực tiếp trên Zoom và tương tác với giáo viên của
            bạn. Trải nghiệm nền tảng được thiết kế để học tập hiệu quả. Quản lý
            bài tập, bài kiểm tra và tài liệu chỉ trong một nơi.
          </p>
        </div>
        <div class="flex justify-center w-full lg:w-1/2">
          <img
            src="/images/bg-home.svg"
            class="w-full max-w-[500px]"
            alt="Platform Preview"
          />
        </div>
      </section>

      <section id="features" class="max-w-screen-xl mx-auto py-20">
        <h2 class="text-4xl text-center font-bold mb-4">
          Cải tiến trải nghiệm học tập của bạn
        </h2>
        <p class="text-lg my-8 text-gray-600 text-center">
          Nền tảng của chúng tôi cải thiện trải nghiệm học trực tuyến, giúp học
          sinh quản lý việc học hiệu quả hơn. Với các công cụ trực quan dành cho
          cả học sinh và giáo viên, bạn có thể dễ dàng điều hướng hành trình học
          tập của mình.
        </p>

        <div class="mx-auto w-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div class="w-full md:w-72 flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 md:aspect-square">
            <div class="p-3 rounded-xl bg-blue-50">
              <BiRegularWorld class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold my-4">Zoom SDK</h3>
            <p class="text-center text-gray-600">
              Tích hợp hoàn toàn Zoom SDK để kết nối trực tiếp lớp học trực
              tuyến từ nền tảng.
            </p>
          </div>

          <div class="w-full md:w-72 flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 md:aspect-square">
            <div class="p-3 rounded-xl bg-red-50">
              <VsCalendar class="w-8 h-8 text-red-600" />
            </div>
            <h3 class="text-2xl font-bold my-4">Thông báo sự kiện</h3>
            <p class="text-center text-gray-600">
              Luôn cập nhật với các thông báo cho lớp học và sự kiện sắp tới.
            </p>
          </div>

          <div class="w-full md:w-72 flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 md:aspect-square">
            <div class="p-3 rounded-xl bg-yellow-50">
              <BsBook class="w-8 h-8 text-yellow-600" />
            </div>
            <h3 class="text-2xl font-bold my-4">Tài nguyên</h3>
            <p class="text-center text-gray-600">
              Truy cập bài tập, kỳ thi và tài liệu hỗ trợ học tập của bạn.
            </p>
          </div>

          <div class="w-full md:w-72 flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 md:aspect-square">
            <div class="p-3 rounded-xl bg-purple-50">
              <FaSolidUsersRectangle class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-2xl text-center font-bold my-4">
              Quản lý học sinh
            </h3>
            <p class="text-center text-gray-600">
              Quản lý hồ sơ học sinh và theo dõi tiến độ của học sinh một cách
              hiệu quả.
            </p>
          </div>

          <div class="w-full md:w-72 flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 md:aspect-square">
            <div class="p-3 rounded-xl bg-indigo-50">
              <AiFillLock class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-2xl font-bold my-4">Bảo mật cao</h3>
            <p class="text-center text-gray-600">
              Đảm bảo tính riêng tư và an toàn cho học sinh và giáo viên trên
              nền tảng của chúng tôi.
            </p>
          </div>

          <div class="w-full md:w-72 flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 md:aspect-square">
            <div class="p-3 rounded-xl bg-pink-50">
              <BiRegularSupport class="w-8 h-8 text-pink-600" />
            </div>
            <h3 class="text-2xl font-bold my-4">Hỗ trợ nhanh chóng</h3>
            <p class="text-center text-gray-600">
              Đội ngũ hỗ trợ luôn sẵn sàng để giúp đỡ bạn bất cứ lúc nào bạn
              cần.
            </p>
          </div>
        </div>
      </section>

      <section id="feedback" class="max-w-screen-xl mx-auto px-4 py-16">
        <h2 class="text-4xl text-center font-bold mb-4">
          Đánh giá của người dùng
        </h2>
        <p class="text-lg my-8 text-gray-600 text-center">
          Khám phá trải nghiệm của học sinh và nhà giáo dục đã thay đổi hành
          trình học tập của họ cùng chúng tôi.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEEDBACKS.map(feedback => (
            <div class="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img
                src={feedback.image}
                alt={`${feedback.name}`}
                class="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto mb-4"
              />
              <h3 class="text-xl font-semibold text-gray-800">
                {feedback.name}
              </h3>
              <p class="text-md text-blue-600 mb-2">{feedback.position}</p>
              <p class="text-gray-700">{feedback.feedback}</p>
            </div>
          ))}
        </div>
      </section>

      {/* <section id="pricing" class="bg-blue-50">
          <div class="max-w-screen-xl mx-auto px-4 py-16 ">
            <h2 class="text-4xl text-center font-bold mb-4">Bảng giá</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING_PLANS.map(plan => (
                <Pricing plan={plan} />
              ))}
            </div>
          </div>
        </section> */}

      <section id="contact" class="max-w-screen-xl mx-auto px-4 py-16">
        <h2 class="text-4xl text-center font-bold mb-4">
          Liên hệ với chúng tôi
        </h2>
        <p class="text-lg my-8 text-gray-600 text-center">
          Chúng tôi rất mong nhận được phản hồi từ bạn! Cho dù bạn có thắc mắc
          về tính năng, giá cả hay bất kỳ điều gì khác, nhóm của chúng tôi luôn
          sẵn sàng trả lời mọi câu hỏi của bạn.
        </p>
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex justify-center w-full lg:w-1/2">
            <img
              src="/images/bg-mailbox.svg"
              alt="Contact Us"
              class="max-w-80"
            />
          </div>
          <div class="flex justify-center w-full lg:w-1/2">
            <form class="w-full max-w-[500px] mt-12 p-2">
              <div class="mb-4">
                <label
                  for="name"
                  class="block text-lg font-semibold text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="name"
                  class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tên của bạn"
                />
              </div>
              <div class="mb-4">
                <label
                  for="email"
                  class="block text-lg font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Email của bạn"
                />
              </div>
              <div class="mb-4">
                <label
                  for="message"
                  class="block text-lg font-semibold text-gray-700">
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  rows="4"
                  class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tin nhắn của bạn"></textarea>
              </div>
              <button
                type="submit"
                class="w-full bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
