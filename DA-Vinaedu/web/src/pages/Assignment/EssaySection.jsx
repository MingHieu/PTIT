import { FileBlock } from '@/shared/components';
import { TbUpload } from 'solid-icons/tb';
import { createEffect, For } from 'solid-js';

function EssaySection({ formData, setFormData, visible }) {
  let fileInputRef;

  createEffect(() => {
    if (visible()) {
      if (fileInputRef) {
        fileInputRef.value = '';
      }
    }
  });

  const handleFileChange = event => {
    const newFiles = Array.from(event.target.files);

    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        files: [
          ...prev.files,
          ...newFiles.filter(
            newFile =>
              !prev.files.some(
                existingFile =>
                  existingFile.name === newFile.name &&
                  existingFile.size === newFile.size &&
                  existingFile.lastModified === newFile.lastModified,
              ),
          ),
        ],
      }));
    }
  };

  const deleteFile = file => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => {
        if (f.id && file.id) {
          return f.id != file.id;
        }
        return !(
          f.name == file.name &&
          f.size == file.size &&
          f.lastModified == file.lastModified
        );
      }),
    }));
  };

  return (
    <div class="bg-white border rounded-xl p-6">
      <h2 class="text-xl font-semibold">Đính kèm</h2>
      <div class="flex justify-center items-center space-x-8">
        <div class="flex flex-col items-center text-sm font-semibold">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            class="hidden"
            id="file-upload"
          />
          <label
            for="file-upload"
            class="p-3 border rounded-full mb-2 hover:bg-gray-100 cursor-pointer">
            <TbUpload class="text-xl" />
          </label>
          Tải lên
        </div>
      </div>
      <div class="flex flex-wrap gap-4 mt-4 justify-center">
        <For each={formData().files}>
          {file => (
            <FileBlock
              file={{
                name: file.name,
                type: file.type,
                url: file.url ? file.url : URL.createObjectURL(file),
              }}
              onDelete={() => deleteFile(file)}
            />
          )}
        </For>
      </div>
    </div>
  );
}

export default EssaySection;
