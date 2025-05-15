import * as React from 'react';
import type { PantryItem } from '../types'
import { useState, useEffect } from 'react';
// TODO: Update the import path if necessary to the correct location of fetchPantryItems
import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Input, Paper, styled, Tab, Tabs, TextField, Typography } from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImages } from '../requests';
import { lightGreen } from '@mui/material/colors';

const img_url = "http://127.0.0.1:5000/static/"

interface PantryListProps {
    pantryItems: PantryItem[];
    updateItems: () => void;
    consuming: boolean;
    onAddToDining: (items: { [id: number]: PantryItem }) => void;
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
    height: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));

interface ItemCardProps {
    item: PantryItem;
    consuming: boolean;
    onAddToDining: (items: { [id: number]: PantryItem }) => void;
}

const ItemCard = ({ item, consuming, onAddToDining }: ItemCardProps) => {
    const onClick = () => {
        if (!consuming) return;
        const item_copy: PantryItem = { ...item, quantity: 1 }; // TODO: Update this to allow for multiple items
        if (onAddToDining) {
            onAddToDining({ [item.id]: item_copy });
        }
    }
    return (
        <Item sx={consuming ? { backgroundColor: lightGreen[50] } : {}} onClick={onClick}><div className={"item-card"}>
            <div className="item-card-left">
                <img className="item-image" src={img_url + item.image} alt={item.ingredient.name} />
            </div>
            <div className="item-card-right">
                <Typography variant="h5" className="item-ingredient">{item.ingredient.name}</Typography>
                <Typography variant="h6" className="item-qty">Amount: {item.quantity}</Typography>
                <Typography variant="caption" className="item-expiration">Expires: {item.expiration}</Typography>
            </div>
        </div>
        </Item>)
}

export default function PantryList({ pantryItems, updateItems, consuming, onAddToDining }: PantryListProps) {
    const [addingItems, setAddingItems] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);;
    return (
        <>
            <h2>Pantry Items</h2>

            <Grid sx={{ margin: 2 }} container rowSpacing={1} columns={{ xs: 4, sm: 8, md: 12 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {pantryItems?.map(item => (
                    <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                        <ItemCard item={item} consuming={consuming} onAddToDining={onAddToDining} />
                    </Grid>
                ))}

                <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                    <Item>
                        <Button sx={{ height: 100 }} onClick={() => setAddingItems(true)}>Add Items</Button>
                    </Item>
                </Grid>
            </Grid >

            {!pantryItems && <CircularProgress />
            }

            <Dialog
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={addingItems}
                onClose={() => !uploading && setAddingItems(false)}
                slotProps={{
                    paper: {
                        component: 'form',
                        sx: { minWidth: 300 },
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            setUploading(true);
                            console.log(files);
                            const pantryId = localStorage.getItem('pantryId');
                            if (pantryId === null) {
                                alert("No pantry id found");
                                return;
                            }
                            await uploadImages(files, pantryId.toString())
                            setUploading(false);
                            setAddingItems(false);
                            setFiles([]);
                            updateItems();

                            // ();
                        },
                    },
                }}
            >
                <DialogTitle>Upload Images</DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{}}>
                            <DialogContentText>
                                Upload an image of your pantry items. We will try to detect the items in the image.
                                {files.length > 0 && (
                                    <Typography variant='body2' component="div" color="success" >{files.length} file{files.length > 1 ? "s" : ""} ready to upload</Typography>
                                )}
                            </DialogContentText>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                sx={{ margin: 1 }}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload photos

                                <input
                                    style={{ display: 'none' }}
                                    accept="image/jpg, image/png, image/jpeg"
                                    type="file"
                                    name="files"
                                    onChange={(event) => setFiles(event.target.files ? Array.from(event.target.files) : [])}
                                    multiple
                                />
                            </Button>
                        </Box>

                    </Box>

                    {/* <TabPanel value="upload">Item One</TabPanel> */}
                    {uploading && <Alert severity="warning">
                        Detecting items from images may take a few seconds. Please don't close the window.
                    </Alert>}

                </DialogContent>

                <DialogActions>
                    <Button disabled={uploading} onClick={() => setAddingItems(false)}>Cancel</Button>
                    <Button type="submit" loading={uploading}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
