import { MenuItem, TextField, IconButton } from "@mui/material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { useIngredientsQuery } from "../../hooks/useIngredientsQuery";
export const IngredientsInput = () => {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });

    const { data: ingredientsList, isLoading } = useIngredientsQuery();

    return (
        <Box display="flex" flexDirection="column" gap={2}>

            {fields.map((field, index) => {

                return (
                    <Box

                        key={field.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{ border: "1px solid #627f34", borderRadius: 2, p: 2, color: "#627f34" }}
                    >
                        <Controller
                            control={control}
                            name={`ingredients.${index}.ingredientId`}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Ingredient"
                                    fullWidth
                                    {...field}
                                    disabled={isLoading}
                                >
                                    {ingredientsList?.map((ingredient) => (
                                        <MenuItem key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <TextField
                            label="Quantity"
                            {...register(`ingredients.${index}.quantity`)}
                            fullWidth
                        />

                        <TextField
                            label="Weight (g)"
                            type="number"
                            {...register(`ingredients.${index}.weight`, { valueAsNumber: true, min: 0 })}
                            fullWidth
                        />

                        <IconButton color="error" onClick={() => remove(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                );
            })}

            <Button
                variant="outlined"
                sx={{
                    color: "#627f34",
                    borderColor: "#627f34",
                }}
                onClick={() => append({ ingredientId: "", quantity: "", weight: 0 })}
            >
                Add Ingredient
            </Button>
        </Box>
    );
};
