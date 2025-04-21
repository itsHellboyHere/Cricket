'use client';
import { useState, useRef, useEffect } from 'react';
import { useActionState } from 'react';
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
  type PercentCrop
} from 'react-image-crop';
import { canvasPreview } from '../utils/canvasPreview';
import { createPost, type State } from "../actions/actions";
import toast from "react-hot-toast";
import 'react-image-crop/dist/ReactCrop.css';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: 1 },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: 4 / 5 },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: 16 / 9 },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: 3 },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: 205 / 78 },
};

type SocialFormat = keyof typeof socialFormats;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): PercentCrop {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function CreatePostForm() {
  // Image state
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const initialState: State = { message: null, errors: {} };

  // File selection handler
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image size should be less than 8MB");
        return;
      }
      setUploadedImageUrl(''); 
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result?.toString() || '');
      reader.readAsDataURL(file);
    }
  };

  // Image load handler
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, socialFormats[selectedFormat].aspectRatio));
  };

  // Format change effect
  useEffect(() => {
    if (imgRef.current && crop) {
      setCrop(centerAspectCrop(
        imgRef.current.width,
        imgRef.current.height,
        socialFormats[selectedFormat].aspectRatio
      ));
    }
  }, [selectedFormat,crop]);

  // Crop preview effect
  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  // STEP 1: Upload cropped image
  const handleImageUpload = async () => {
    if (!completedCrop || !previewCanvasRef.current) {
      toast.error("Please crop your image first");
      return;
    }

    setIsUploading(true);
    try {
      const blob = await new Promise<Blob | null>(resolve => 
        previewCanvasRef.current?.toBlob(resolve, 'image/jpeg', 0.9)
      );

      if (!blob) throw new Error("Failed to create image blob");

      const uploadData = new FormData();
      uploadData.append('file', blob);
      uploadData.append('format', JSON.stringify(socialFormats[selectedFormat]));

      const res = await fetch('/api/image-upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) throw new Error(await res.text() || "Upload failed");

      const { url } = await res.json();
      setUploadedImageUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // STEP 2: Submit post with uploaded image
  const handleSubmit = async (
    prevState: State,
    formData: FormData
  ): Promise<State> => {
    if (!uploadedImageUrl) {
      return {
        ...prevState,
        errors: { imageUrl: ["Image not uploaded"] },
        message: "Validation failed"
      };
    }

    formData.append('imageUrl', uploadedImageUrl);
    
    try {
      // 4. Properly typed action call
      const result = await createPost(prevState, formData);
      return result;
    } catch (err) {
      return {
        ...prevState,
        message: "Submission failed",
        errors: { imageUrl: [err instanceof Error ?err.message:"Failed to Create Post"] }
      };
    }
  };

  const [state, formAction] = useActionState(handleSubmit, initialState);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-medium text-gray-500 mb-3 text-center">
        Create new post
      </h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form ref={formRef} action={formAction}>
            {/* Title field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Post Title</span>
              </label>
              <input
                name="title"
                placeholder="Enter post title"
                className="input input-bordered w-full"
                required
              />
              {state.errors?.title?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
            </div>

            {/* Image selection */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Upload Image</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onSelectFile}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary ml-4"
              >
                Select Image
              </button>
            </div>

            {/* STEP 1: Cropping interface */}
            {imgSrc && !uploadedImageUrl && (
              <>
                <div className="form-control mt-6">
                  <label className="label font-semibold text-lg">
                    <span className="label-text">Select Format</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                    onComplete={setCompletedCrop}
                    aspect={socialFormats[selectedFormat].aspectRatio}
                    className="max-h-[500px] bg-gray-100 rounded-lg"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[500px]"
                    />
                  </ReactCrop>
                </div>

                {completedCrop && (
                  <div className="mt-6">
                    <label className="label">
                      <span className="label-text">Cropped Preview</span>
                    </label>
                    <div className="flex justify-center">
                      <canvas
                        ref={previewCanvasRef}
                        style={{
                          width: `${socialFormats[selectedFormat].width / 4}px`,
                          height: `${socialFormats[selectedFormat].height / 4}px`,
                          border: '1px solid #ddd',
                          borderRadius: '0.5rem',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="btn btn-primary"
                    disabled={!completedCrop || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Uploading Image...
                      </>
                    ) : "Confirm & Upload"}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Final submission */}
            {uploadedImageUrl && (
              <>
                <div className="mt-6">
                  <label className="label">
                    <span className="label-text">Ready to Post</span>
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    <img 
                      src={uploadedImageUrl} 
                      alt="Final upload" 
                      className="max-w-full rounded-lg border border-gray-200"
                    />
                    <button 
                      type="button" 
                      onClick={() => setUploadedImageUrl('')}
                      className="btn btn-ghost btn-sm"
                    >
                      Change Image
                    </button>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button type="submit" className="btn btn-success">
                    Create Post
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}