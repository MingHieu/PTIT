import api from '@/core/api';
import { InputErrMsg } from '@/shared/components';
import { validatePassword } from '@/shared/utils';
import { createSignal } from 'solid-js';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = createSignal('');
  const [newPassword, setNewPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!validatePassword(newPassword())) {
      newErrors.newPassword =
        'Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
      isValid = false;
    }
    if (newPassword() !== confirmPassword()) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await api.post('user/update-password', {
        currentPassword: currentPassword(),
        newPassword: newPassword(),
      });
      e.target.reset();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <div class="max-w-lg mx-auto">
      <form class="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label class="block font-semibold">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword()}
            onInput={e => setCurrentPassword(e.target.value)}
            class="w-full p-2 border border-gray-300 rounded"
            disabled={loading()}
            autocomplete="current-password"
          />
        </div>

        <div>
          <label class="block font-semibold">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword()}
            onInput={e => setNewPassword(e.target.value)}
            class={`w-full p-2 border ${
              errors().newPassword ? 'border-red-500' : 'border-gray-300'
            } rounded`}
            disabled={loading()}
          />
          <InputErrMsg error={() => errors().newPassword} />
        </div>

        <div>
          <label class="block font-semibold">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword()}
            onInput={e => setConfirmPassword(e.target.value)}
            class={`w-full p-2 border ${
              errors().confirmPassword ? 'border-red-500' : 'border-gray-300'
            } rounded`}
            disabled={loading()}
          />
          <InputErrMsg error={() => errors().confirmPassword} />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            class={`${
              loading()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } px-4 py-2 rounded-lg`}
            disabled={loading()}>
            {loading() ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
