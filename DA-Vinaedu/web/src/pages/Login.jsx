import { API_BASE_URL } from '@/configs';
import api from '@/core/api';
import { InputErrMsg, Loading } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { validatePassword } from '@/shared/utils';
import { Title } from '@solidjs/meta';
import { useLocation } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import toast from 'solid-toast';

function Login() {
  const { setAuthInfo } = useAuth();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [errors, setErrors] = createSignal({
    email: '',
    password: '',
  });
  const [loading, setLoading] = createSignal(false);
  const [isCheckingGoogleAuth, setIsCheckingGoogleAuth] = createSignal(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const checkGoogleAuth = async () => {
    let toastId;
    setIsCheckingGoogleAuth(true);
    try {
      const token = queryParams.get('token');
      if (token) {
        toastId = toast.loading('Đang xử lý', {
          position: 'top-center',
        });
        const user = await api.get('user/me', {
          headers: { Authorization: 'Bearer ' + token },
        });
        setAuthInfo({ user, token });
        toast.success('Thành công', { id: toastId });
        window.location.href = '/classroom';
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra', { id: toastId });
    }
    setIsCheckingGoogleAuth(false);
  };

  checkGoogleAuth();

  const validate = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    if (!email().trim()) {
      newErrors.email = 'Email không được bỏ trống';
      isValid = false;
    }
    if (!validatePassword(password())) {
      newErrors.password =
        'Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('auth/login', {
        email: email(),
        password: password(),
      });
      setAuthInfo(data);
      window.location.href = '/classroom';
    } catch (error) {}
    setLoading(false);
  };

  return (
    <>
      <Title>VinaEdu - Đăng nhập</Title>
      <Show when={!isCheckingGoogleAuth()}>
        <div class="h-screen flex flex-col">
          <header class="w-full py-8">
            <div class="container mx-auto px-4">
              <a href="/">
                <h1 class="text-3xl font-bold text-blue-600">VinaEdu</h1>
              </a>
            </div>
          </header>

          <div class="relative flex-grow flex items-center z-10">
            <div class="absolute inset-0 z-[-1] flex justify-center lg:justify-end p-8">
              <div class="w-0 lg:w-1/2 flex justify-center">
                <img
                  src="/images/bg-login.svg"
                  alt="bg-login"
                  class="w-[500px] h-auto"
                />
              </div>
            </div>

            <div class="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-6 px-4">
              <div class="w-[28rem] bg-white p-8 rounded-3xl shadow-lg border border-blue-300">
                <h2 class="text-2xl font-bold text-gray-700 mb-6 text-center">
                  Đăng nhập
                </h2>
                <form class="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label class="block text-gray-600">Email</label>
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email()}
                      onInput={e => setEmail(e.target.value)}
                      class={`w-full px-4 py-2 border ${
                        errors().email ? 'border-red-500' : 'border-gray-300'
                      } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      autocomplete="email"
                    />
                    <InputErrMsg error={() => errors().email} />
                  </div>
                  <div>
                    <label class="block text-gray-600">Mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password()}
                      onInput={e => setPassword(e.target.value)}
                      class={`w-full px-4 py-2 border ${
                        errors().password ? 'border-red-500' : 'border-gray-300'
                      } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      autocomplete="current-password"
                    />
                    <InputErrMsg error={() => errors().password} />
                  </div>
                  <button
                    disabled={loading()}
                    class={`w-full text-white py-2 rounded ${
                      loading()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition`}>
                    {loading() ? <Loading /> : 'Đăng nhập'}
                  </button>
                </form>
                <div class="flex items-center justify-between my-6">
                  <hr class="w-full border-gray-300" />
                  <span class="px-4 text-gray-500">hoặc</span>
                  <hr class="w-full border-gray-300" />
                </div>
                <a
                  href={API_BASE_URL + '/auth/google'}
                  class="w-full flex items-center justify-center space-x-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition">
                  <img
                    src="/images/ic-google.png"
                    alt="Google Logo"
                    class="h-6 w-6"
                  />
                  <span class="text-gray-600">Đăng nhập với Google</span>
                </a>
                <p class="text-center text-gray-600 mt-6">
                  Không có tài khoản?{' '}
                  <a href="/register" class="text-blue-600 hover:underline">
                    Đăng ký
                  </a>
                </p>
              </div>
            </div>
          </div>

          <footer class="text-center text-gray-500 py-8">
            Cung cấp bởi VinaEdu © 2024.
          </footer>
        </div>
      </Show>
    </>
  );
}

export default Login;
