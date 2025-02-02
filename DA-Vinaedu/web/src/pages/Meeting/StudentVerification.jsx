import * as cv from 'opencv.js';
import { createSignal, Match, onCleanup, onMount, Switch } from 'solid-js';
import toast from 'solid-toast';
import { useMeeting } from '.';

function StudentVerification() {
  const { setIsVerified, checkInOut } = useMeeting();
  const [videoStream, setVideoStream] = createSignal(null);
  const [hasFace, setHasFace] = createSignal(false);
  const [isVerifying, setIsVerifying] = createSignal(false);
  const [isVerifiedFail, setIsVerifiedFail] = createSignal(false);
  let videoElement;
  let canvasElement;
  let faceCascade;
  let streaming = true;
  let canVerify = false;
  let canVerifyTimer;

  onMount(() => {
    loadHaarCascade().then(() => {
      startVideo();
    });
  });

  onCleanup(() => {
    const stream = videoStream();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    streaming = false;
  });

  const loadHaarCascade = async () => {
    const xmlModelUrl = '/raw/haarcascade_frontalface_default.xml';
    const xmlPath = 'haarcascade_frontalface_default.xml';

    faceCascade = new cv.CascadeClassifier();

    try {
      const response = await fetch(xmlModelUrl);
      const data = await response.arrayBuffer();
      const uint8Array = new Uint8Array(data);
      cv.FS_createDataFile('/', xmlPath, uint8Array, true, false, false);
      faceCascade.load(xmlPath);
    } catch (error) {}
  };

  const waitForVerify = () => {
    if (canVerifyTimer) {
      clearTimeout(canVerifyTimer);
    }
    canVerify = false;
    canVerifyTimer = setTimeout(() => {
      canVerify = true;
    }, 2000);
  };

  const startVideo = async () => {
    streaming = true;
    setIsVerifiedFail(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoStream(stream);
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        waitForVerify();
        detectFaces();
      };
    } catch (err) {
      toast.error('Không truy cập được webcam. Hãy thử lại sau');
    }
  };

  const createCanvasForVideo = () => {
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.save();
    context.scale(-1, 1);
    context.drawImage(videoElement, -width, 0, width, height);
    context.restore();
    return canvas;
  };

  const detectFaces = () => {
    const processVideo = () => {
      if (!streaming) return;

      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;

      const tempCanvas = createCanvasForVideo();
      const tempContext = tempCanvas.getContext('2d');
      const imageData = tempContext.getImageData(0, 0, width, height);

      const src = new cv.Mat(height, width, cv.CV_8UC4);
      const gray = new cv.Mat();
      const faces = new cv.RectVector();

      src.data.set(imageData.data);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      faceCascade.detectMultiScale(gray, faces);
      setHasFace(faces.size() > 0);

      if (faces.size() > 0) {
        const context = canvasElement.getContext('2d');
        context.clearRect(0, 0, width, height);

        for (let i = 0; i < faces.size(); ++i) {
          const { x, y, width, height } = faces.get(i);
          context.strokeStyle = 'red';
          context.lineWidth = 2;
          context.strokeRect(x, y, width, height);
        }
        verifyFace();
      }

      src.delete();
      gray.delete();
      faces.delete();

      if (streaming) {
        requestAnimationFrame(processVideo);
      }
    };

    processVideo();
  };

  const verifyFace = async () => {
    if (!canVerify) {
      return;
    }
    streaming = false;
    setIsVerifying(true);
    const canvas = createCanvasForVideo();
    const imageData = canvas.toDataURL('image/jpeg');
    try {
      await checkInOut(imageData);
      setIsVerified(true);
    } catch (error) {
      setIsVerifiedFail(true);
    }
    setIsVerifying(false);
  };

  return (
    <div class="h-screen p-2 flex flex-col justify-center items-center">
      <Switch
        fallback={
          <div class="relative w-full max-w-screen-sm aspect-square border-2 border-gray-200 rounded-xl overflow-hidden">
            <video
              ref={videoElement}
              autoPlay
              playsinline
              muted
              width="640"
              height="480"
              class="w-full h-full object-cover -scale-x-100"></video>
            <canvas
              ref={canvasElement}
              class="w-full h-full object-cover absolute top-0 left-0 z-10"
              width="640"
              height="480"></canvas>
            <div class="absolute bottom-0 left-0 right-0 text-center text-white bg-black bg-opacity-40 p-4">
              <h2 class="text-xl font-semibold">
                Hãy giữ mặt trong khung hình để điểm danh
              </h2>
              <Show when={!hasFace()}>
                <p class="mt-2 text-lg">Không nhận diện được khuôn mặt</p>
              </Show>
              <p class="mt-2 text-lg">
                Đảm bảo mặt bạn được nhận diện rõ ràng để hoàn thành điểm danh.
              </p>
            </div>
          </div>
        }>
        <Match when={isVerifying()}>
          <p class="text-3xl font-semibold text-center mb-6">
            Đang xác thực khuôn mặt
          </p>
          <lottie-player
            src="https://lottie.host/205bd9d5-6ba5-40ee-88be-8f3d7aad492a/CTJ0IcjjLO.json"
            speed="1"
            style="height: 50%; aspect-ratio: 1"
            loop
            autoplay
            direction="1"
            mode="normal"></lottie-player>
        </Match>

        <Match when={isVerifiedFail()}>
          <p class="text-3xl text-red-600 font-semibold text-center mb-2">
            Xác thực thất bại
          </p>
          <button
            onClick={startVideo}
            class="text-blue-600 hover:underline mb-6">
            Thử lại
          </button>
          <lottie-player
            src="https://lottie.host/b18d9be0-c5ad-4d06-a3b2-c4c33eb2303a/2LnE1RKuaD.json"
            speed="0.5"
            style="height: 50%; aspect-ratio: 1"
            loop
            autoplay
            direction="1"
            mode="normal"></lottie-player>
        </Match>
      </Switch>
    </div>
  );
}

export default StudentVerification;
