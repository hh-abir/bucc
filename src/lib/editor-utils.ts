import { toast } from "sonner";

export const handleImageUpload = (file: File, view: any, pos: number) => {
  // Check file type
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");
    return;
  }
  
  // Check file size (max 5MB)
  if (file.size / 1024 / 1024 > 5) {
    toast.error("File size too big (max 5MB).");
    return;
  }

  const id = "loading-image";

  // Placeholder while uploading
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target?.result as string;
    // Note: Novel/Tiptap handles placeholders differently, 
    // but for simplicity we'll just wait for the real URL.
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append("file", file);

  toast.promise(
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      // Insert image into editor
      const { schema } = view.state;
      const node = schema.nodes.image.create({ src: url });
      const transaction = view.state.tr.insert(pos, node);
      view.dispatch(transaction);
      
      return "Image uploaded successfully";
    }),
    {
      loading: "Uploading image...",
      success: (data) => data,
      error: (err) => err.message,
    }
  );
};
