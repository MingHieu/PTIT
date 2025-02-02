import { API_BASE_URL } from '@/configs';
import api from '@/core/api';
import { InputErrMsg, Loading } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { validatePassword } from '@/shared/utils';
import { Title } from '@solidjs/meta';
import { createSignal } from 'solid-js';

function Register() {
  const { setAuthInfo } = useAuth();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [showPasswordFields, setShowPasswordFields] = createSignal(false);
  const [errors, setErrors] = createSignal({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = createSignal(false);

  const validate = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!email().trim()) {
      newErrors.email = 'Email không được bỏ trống';
      isValid = false;
    }
    if (showPasswordFields()) {
      if (!validatePassword(password())) {
        newErrors.password =
          'Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
        isValid = false;
      }
      if (password() !== confirmPassword()) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPasswordFields(true);
    }, 1000);
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('auth/signup', {
        email: email(),
        password: password(),
      });
      setAuthInfo(data);
      window.location.href = '/classroom';
    } catch (error) {}
    setLoading(false);
  };

  const onFormSubmit = e => {
    e.preventDefault();
    showPasswordFields() ? handleRegister() : handleContinue();
  };

  return (
    <>
      <Title>VinaEdu - Đăng ký tài khoản</Title>
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
                src="/images/bg-register.svg"
                alt="bg-register"
                class="w-[500px] h-auto"
              />
            </div>
          </div>

          <div class="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-6 px-4">
            <div class="w-[28rem] bg-white p-8 rounded-3xl shadow-lg border border-blue-300">
              <h2 class="text-2xl font-bold text-gray-700 mb-6 text-center">
                Tạo tài khoản
              </h2>
              <form class="space-y-4" onsubmit={onFormSubmit}>
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
                {showPasswordFields() && (
                  <>
                    <div>
                      <label class="block text-gray-600">Mật khẩu</label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password()}
                        onInput={e => setPassword(e.target.value)}
                        class={`w-full px-4 py-2 border ${
                          errors().password
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        autocomplete="new-password"
                      />
                      <InputErrMsg error={() => errors().password} />
                      <p class="text-sm text-gray-500 mt-1">
                        Từ 6 ký tự, gồm 1 chữ hoa, 1 số, 1 ký tự đặc biệt
                      </p>
                    </div>
                    <div>
                      <label class="block text-gray-600">
                        Mật khẩu xác nhận
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword()}
                        onInput={e => setConfirmPassword(e.target.value)}
                        class={`w-full px-4 py-2 border ${
                          errors().confirmPassword
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        autocomplete="new-password"
                      />
                      <InputErrMsg error={() => errors().confirmPassword} />
                    </div>
                  </>
                )}
                <button
                  class={`w-full py-2 rounded ${
                    loading()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition`}
                  disabled={loading()}>
                  {loading() ? (
                    <Loading />
                  ) : showPasswordFields() ? (
                    'Đăng ký'
                  ) : (
                    'Tiếp tục'
                  )}
                </button>
              </form>
              <div class="mt-4">
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
              </div>
              <p class="text-center text-gray-600 mt-6">
                Đã có tài khoản?{' '}
                <a href="/login" class="text-blue-600 hover:underline">
                  Đăng nhập
                </a>
              </p>
            </div>
          </div>
        </div>

        <footer class="text-center text-gray-500 py-8">
          Cung cấp bởi VinaEdu © 2024.
        </footer>
      </div>
    </>
  );
}

export default Register;
