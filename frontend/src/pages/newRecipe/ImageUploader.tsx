import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { CreateRecipeDto } from "../../types/recipe.types";

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const ImageUploader = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { setValue } = useFormContext<CreateRecipeDto>();

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            setPreview(base64);
            setValue("imageUrl", base64, { shouldValidate: true });
        } catch (error) {
            console.error("Failed to convert file to base64", error);
            setValue("imageUrl", null);
            setPreview(null);
        }
    }, [preview, setValue]);

    const handleRemove = () => {
        setPreview(null);
        setValue("imageUrl", null, { shouldValidate: true });
        if (inputRef.current) inputRef.current.value = "";
    };
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            {preview && (
                <Box
                    loading='lazy'
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{ width: 200, height: 200, objectFit: "contain", borderRadius: 2 }}
                />
            )}

            <Button variant="contained" component="label" className="bg-primary!">
                Upload Image
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={inputRef}
                    onChange={handleFileChange}
                />
            </Button>

            {preview && (
                <Button variant="outlined" color="error" onClick={handleRemove}>
                    Remove
                </Button>
            )}
        </Box>
    );
};

export default ImageUploader;
