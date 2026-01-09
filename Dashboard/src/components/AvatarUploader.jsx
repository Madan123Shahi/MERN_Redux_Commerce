import Cropper from "react-easy-crop";
import { useState } from "react";
import { getCroppedImg } from "../utils/cropImage";
import { useDispatch } from "react-redux";
import { uploadAvatar } from "../redux/authSlice";

export default function AvatarUploader() {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleUpload = async () => {
    const blob = await getCroppedImg(image, croppedAreaPixels);
    const formData = new FormData();
    formData.append("avatar", blob);

    dispatch(uploadAvatar(formData));
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
      />

      {image && (
        <div className="relative w-72 h-72">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <button onClick={handleUpload} className="btn-primary">
        Save Avatar
      </button>
    </>
  );
}
