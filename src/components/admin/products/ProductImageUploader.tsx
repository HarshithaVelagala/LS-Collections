"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Star, ArrowLeft, ArrowRight, Loader2, FileImage } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

interface MediaAsset {
  url: string;
  public_id?: string;
  type?: "image" | "video";
}

interface ProductImageUploaderProps {
  media: MediaAsset[];
  onChange: (assets: MediaAsset[]) => void;
  category: string;
}

export default function ProductImageUploader({ media, onChange, category }: ProductImageUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // File type validation
  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: `${file.name} is not supported. Use JPG, PNG, or WEBP.`,
        className: "bg-rose-500 text-white border-rose-400"
      });
      return false;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `${file.name} exceeds 5MB size limit.`,
        className: "bg-rose-500 text-white border-rose-400"
      });
      return false;
    }
    return true;
  };

  // Helper to strictly filter out broken, empty, or placeholder image objects
  const getValidMedia = (mediaArray: MediaAsset[]) => {
    return (mediaArray || []).filter((asset) => {
      if (!asset || typeof asset.url !== "string") return false;
      const url = asset.url.trim();
      return url !== "" && url !== "undefined" && url !== "null" && url !== "placeholder";
    });
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    // Filter out any invalid items before appending new ones
    const uploadedAssets: MediaAsset[] = getValidMedia(media);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateFile(file)) continue;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          uploadedAssets.push({
            url: data.url,
            public_id: data.public_id,
            type: "image",
          });
        } else {
          toast({
            title: "Upload Failed",
            description: data.message || "Failed to upload image.",
            className: "bg-rose-500 text-white border-rose-400"
          });
        }
      }
      onChange(uploadedAssets);
    } catch (e) {
      toast({
        title: "Upload Error",
        description: "Failed to connect to image upload services.",
        className: "bg-rose-500 text-white border-rose-400"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (idxToRemove: number) => {
    const updated = media.filter((_, idx) => idx !== idxToRemove);
    onChange(updated);
  };

  // Reordering images: shift positions left or right
  const moveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === media.length - 1) return;

    const newIndex = direction === "left" ? index - 1 : index + 1;
    const updated = [...media];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onChange(updated);
  };

  // Set primary product image (moves it to index 0)
  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    const updated = [...media];
    const primaryAsset = updated.splice(index, 1)[0];
    updated.unshift(primaryAsset);
    onChange(updated);

    toast({
      title: "Primary Asset Updated",
      description: "Selected asset set as primary storefront display thumbnail.",
      className: "bg-emerald-500 text-white border-emerald-400",
    });
  };

  // Filter out any empty, null, or invalid image objects before rendering
  const validMedia = getValidMedia(media);

  return (
    <div className="space-y-4 text-white select-none">
      
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed py-8 px-4 rounded-none text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 bg-zinc-950 ${
          dragActive 
            ? "border-gold bg-purple-royal/5" 
            : "border-purple-royal/10 hover:border-gold/30 hover:bg-zinc-900/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-light">Uploading assets...</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-10 w-10 text-zinc-500" />
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Drag & Drop Images Here</p>
              <p className="text-[10px] text-zinc-500 font-light mt-1">Supports PNG, JPG, or WEBP up to 5MB</p>
            </div>
          </>
        )}
      </div>

      {/* Media Previews & Sorting */}
      {validMedia.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 pt-2">
          {validMedia.map((asset, idx) => {
            const isPrimary = idx === 0;

            return (
              <div 
                key={asset.url + idx} 
                className={`relative border bg-zinc-900 overflow-hidden group flex flex-col h-48 justify-between ${
                  isPrimary ? "border-gold" : "border-purple-royal/10"
                }`}
              >
                {/* Image Wrap */}
                <div className="relative flex-1 bg-black">
                  <Image src={asset.url} alt={`Asset ${idx}`} fill className="object-cover" />
                  {isPrimary && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 text-[8px] bg-gold text-black font-extrabold px-1.5 py-0.5 uppercase tracking-wider shadow-md">
                      <Star className="h-2.5 w-2.5 fill-black" /> Primary
                    </span>
                  )}
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = validMedia.filter((_, i) => i !== idx);
                      onChange(updated);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 bg-black/80 hover:bg-rose-900 border border-purple-royal/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Ordering & Selection Actions */}
                <div className="bg-black/90 p-2 flex justify-between items-center border-t border-purple-royal/5">
                  {/* Shift Actions */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={idx === 0 || validMedia.length === 1}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...validMedia];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        onChange(updated);
                      }}
                      className="p-1 text-zinc-500 hover:text-gold disabled:text-zinc-800 disabled:hover:text-zinc-800 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === validMedia.length - 1 || validMedia.length === 1}
                      onClick={() => {
                        if (idx === validMedia.length - 1) return;
                        const updated = [...validMedia];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        onChange(updated);
                      }}
                      className="p-1 text-zinc-500 hover:text-gold disabled:text-zinc-800 disabled:hover:text-zinc-800 cursor-pointer"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Make Primary Action */}
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...validMedia];
                        const primaryAsset = updated.splice(idx, 1)[0];
                        updated.unshift(primaryAsset);
                        onChange(updated);
                        
                        toast({
                          title: "Primary Asset Updated",
                          description: "Selected asset set as primary storefront display thumbnail.",
                          className: "bg-emerald-500 text-white border-emerald-400",
                        });
                      }}
                      className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 hover:text-gold flex items-center gap-1 cursor-pointer"
                    >
                      <FileImage className="h-3 w-3" /> Make Primary
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
