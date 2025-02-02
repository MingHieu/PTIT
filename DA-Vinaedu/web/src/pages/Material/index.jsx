import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { FileBlock, useDialog } from '@/shared/components';
import { AiOutlineEdit } from 'solid-icons/ai';
import { RiSystemDeleteBinLine } from 'solid-icons/ri';
import { VsAdd } from 'solid-icons/vs';
import { createSignal, For, Show, Suspense } from 'solid-js';
import MaterialFormPopup from './MaterialFormPopup';
import UrlWithTitle from './UrlWithTitle';

function Material() {
  const { materials, isOwner, setMaterials } = useClassroom();
  const [isPopupOpen, setPopupOpen] = createSignal(false);
  const [editingMaterial, setEditingMaterial] = createSignal(null);
  const { showDialog } = useDialog();

  const handleCreateMaterial = () => {
    setEditingMaterial(null);
    setPopupOpen(true);
  };

  const handleEditMaterial = material => {
    setEditingMaterial(material);
    setPopupOpen(true);
  };

  const handleDeleteMaterial = async materialId => {
    showDialog({
      type: 'confirm',
      text: 'Bạn có muốn xoá tài liệu này không?',
      async onConfirm() {
        try {
          await api.post(`material/${materialId}/delete`);
          setMaterials(prev => prev.filter(m => m.id !== materialId));
        } catch (error) {}
      },
    });
  };

  const closePopup = () => setPopupOpen(false);

  const MaterialItem = ({ material }) => {
    return (
      <div class="bg-white p-4 rounded-lg space-y-4">
        <div class="flex justify-between items-center">
          <p class="font-semibold break-words">{material.title}</p>

          <Show when={isOwner()}>
            <div class="flex space-x-4">
              <button
                onClick={() => handleEditMaterial(material)}
                class="flex items-center text-blue-600">
                <AiOutlineEdit class="text-xl mr-2" />
                Sửa
              </button>
              <button
                onClick={() => handleDeleteMaterial(material.id)}
                class="flex items-center text-red-600">
                <RiSystemDeleteBinLine class="text-lg mr-2" />
                Xóa
              </button>
            </div>
          </Show>
        </div>

        <Show when={material.url}>
          <UrlWithTitle url={material.url} />
        </Show>

        <Show when={material.file}>
          <div class="w-fit">
            <FileBlock file={material.file} />
          </div>
        </Show>
      </div>
    );
  };

  return (
    <div class="flex-grow bg-gray-100 p-6">
      <Suspense
        fallback={
          <div class="max-w-screen-md mx-auto h-[70vh] rounded-xl animate-skeleton" />
        }>
        <div class="max-w-screen-md mx-auto">
          <Show when={isOwner()}>
            <button
              onClick={handleCreateMaterial}
              class="flex items-center bg-blue-500 text-white px-4 py-2 mb-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
              <VsAdd class="mr-2" />
              Tạo mới
            </button>
          </Show>

          <Show
            when={materials().length}
            fallback={
              <p class="bg-white border p-6 rounded-xl text-gray-500 text-xl text-center py-6">
                Không có tài liệu nào
              </p>
            }>
            <div class="space-y-4">
              <For each={materials()}>
                {material => <MaterialItem material={material} />}
              </For>
            </div>
          </Show>
        </div>

        <MaterialFormPopup
          onClose={closePopup}
          visible={isPopupOpen}
          material={editingMaterial}
        />
      </Suspense>
    </div>
  );
}

export default Material;
