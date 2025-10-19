"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { CircleX, Search, Upload, UploadCloud } from "lucide-react"


const GalleryToolBar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  // Clean up the object URLs to prevent memory leaks
  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="flex items-end lg:gap-6 w-full max-lg:flex-wrap">
      <div className="w-full flex items-end gap-5">
        {/* Search Input */}
        <div className="w-4/6 lg:w-2/5 pr-2.5 lg:pr-0 relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 !w-7" />
          <Input
            id="search"
            placeholder="Search"
            className="border border-gray-300 bg-white rounded-lg placeholder:text-primary/50 placeholder:font-medium placeholder:text-base h-10 pl-10 !py-0 !text-base"
          />
        </div>

        {/* Search Button */}
        <Button className="mt-5 lg:mt-0">
          Search Gallery
        </Button>
      </div>

      {/* Upload Dialog Here */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button><Upload className="w-5" /> Upload Image</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader className="border-b border-b-gray-300 pb-5">
            <DialogTitle>Upload New Images</DialogTitle>
            <DialogDescription>
              Add new images to your gallery.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* File Dropzone */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-10 text-center transition-colors
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
                cursor-pointer
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <UploadCloud className="mx-auto size-24 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {isDragActive
                    ? "Drop the files here ..."
                    : "Drag 'n' drop some files here, or click to select files"}
                </p>
              </div>
            </div>
            
            {/* File Preview Grid */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                <div className="flex flex-wrap gap-4">
                  {files.map(file => (
                    <div key={file.name} className="relative h-28 aspect-square rounded-md overflow-hidden border border-gray-200">
                      <Image
                        fill
                        src={file.preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                        onLoad={() => URL.revokeObjectURL(file.preview)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="border-t border-gray-300 pt-5">
            <Button onClick={() => console.log(files)} disabled={files.length === 0}>
              Upload
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setFiles([])}>
                <CircleX className="w-4 mr-2" /> Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryToolBar;