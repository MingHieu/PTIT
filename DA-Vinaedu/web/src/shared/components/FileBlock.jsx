import mammoth from 'mammoth';
import { TiDeleteOutline } from 'solid-icons/ti';
import { VsClose } from 'solid-icons/vs';
import {
  createEffect,
  createSignal,
  Match,
  mergeProps,
  Show,
  Switch,
} from 'solid-js';
import * as XLSX from 'xlsx';
import { FILE_TYPES, getFileType } from '../utils';
import { Popup } from './Popup';

const fileTypeIcons = {
  [FILE_TYPES.document]: '/images/ic-docx.png',
  [FILE_TYPES.pdf]: '/images/ic-pdf.png',
  [FILE_TYPES.spreadsheet]: '/images/ic-xsl.png',
  [FILE_TYPES.image]: '/images/ic-image.png',
  [FILE_TYPES.zip]: '/images/ic-zip.png',
  [FILE_TYPES.default]: '/images/ic-file.png',
};

export function FileBlock(props) {
  const finalProps = mergeProps({ width: 100, height: null }, props);
  const [isPreview, setIsPreview] = createSignal(false);

  const showPreview = () => {
    setIsPreview(true);
  };

  const closePreview = () => {
    setIsPreview(false);
  };

  return (
    <>
      <div
        onClick={showPreview}
        class="relative flex flex-col items-center space-y-2 cursor-pointer"
        target="_blank"
        style={[
          finalProps.width && { width: `${finalProps.width}px` },
          finalProps.height && { height: `${finalProps.height}px` },
        ]}>
        <div class="flex items-center justify-center border rounded-lg w-16 h-16 p-3">
          <img
            src={
              fileTypeIcons[getFileType(finalProps.file.type)] ||
              fileTypeIcons.default
            }
            alt="File Icon"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="font-semibold text-center text-xs max-w-20 overflow-hidden text-ellipsis line-clamp-2 break-words">
          {finalProps.file.name}
        </div>
        <Show when={finalProps.onDelete}>
          <button
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              finalProps.onDelete();
            }}
            class="absolute -top-4 right-2 z-10">
            <TiDeleteOutline class="text-red-600 text-2xl" />
          </button>
        </Show>
      </div>
      <FilePreviewer
        visible={isPreview}
        onClose={closePreview}
        file={finalProps.file}
      />
    </>
  );
}

const FilePreviewer = props => {
  const type = () => getFileType(props.file.type);
  const [loading, setLoading] = createSignal(false);
  const [fileHtml, setFileHtml] = createSignal();
  const [localFileUrl, setLocalFileUrl] = createSignal();

  createEffect(() => {
    if (props.visible()) {
      if (type() == FILE_TYPES.pdf) {
        fetchPdfContent();
      }
      if (type() == FILE_TYPES.document) {
        convertDocumentToHtml();
      }
      if (type() == FILE_TYPES.spreadsheet) {
        convertSheetToHtml();
      }
    }
  });

  const downloadFile = async () => {
    setLoading(true);
    try {
      const res = await fetch(props.file.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = props.file.name;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {}
    setLoading(false);
  };

  const fetchPdfContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(props.file.url);
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      setLocalFileUrl(URL.createObjectURL(pdfBlob));
    } catch (error) {}
    setLoading(false);
  };

  const convertDocumentToHtml = async () => {
    setLoading(true);
    try {
      const res = await fetch(props.file.url);
      const arrayBuffer = await res.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      setFileHtml(result.value);
    } catch (error) {}
    setLoading(false);
  };

  const convertSheetToHtml = async () => {
    setLoading(true);
    try {
      const res = await fetch(props.file.url);
      const arrayBuffer = await res.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const html = XLSX.utils.sheet_to_html(sheet, { id: 'sheet-table' });
      setFileHtml(html);
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup visible={props.visible} onClose={props.onClose}>
      <div class="p-6 w-screen max-w-screen-lg">
        <div class="bg-white rounded-lg p-6 space-y-4 max-h-[90vh] overflow-auto">
          <div class="flex items-center justify-between">
            <button
              onClick={downloadFile}
              class={`${
                loading()
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-blue-600 hover:underline '
              }`}
              disabled={loading()}>
              {loading() ? 'Đang tải...' : 'Tải về'}
            </button>
            <p class="text-xl font-semibold">{props.file.name}</p>
            <button onClick={props.onClose}>
              <VsClose class="w-7 h-7" />
            </button>
          </div>
          <div class="overflow-auto">
            <Switch
              fallback={
                <p class="text-2xl text-center text-gray-500 p-6">
                  Không thể xem trước tập tin này
                </p>
              }>
              <Match when={loading()}>
                <p class="text-2xl text-center text-gray-500 p-6">
                  Đang tải dữ liệu...
                </p>
              </Match>
              <Match when={type() == FILE_TYPES.pdf}>
                <embed
                  src={localFileUrl()}
                  type="application/pdf"
                  class="w-full h-[80vh]"
                />
              </Match>
              <Match when={type() == FILE_TYPES.document}>
                <div innerHTML={fileHtml()} />
              </Match>
              <Match when={type() == FILE_TYPES.spreadsheet}>
                <div innerHTML={fileHtml()} />
              </Match>
              <Match when={type() == FILE_TYPES.image}>
                <img src={props.file.url} />
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </Popup>
  );
};
