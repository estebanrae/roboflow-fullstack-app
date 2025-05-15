import PantryList from '../components/PantryList';
import type { PantryItem } from '../types'
import Menu from '../components/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import KitchenIcon from '@mui/icons-material/Kitchen';

import '../App.css'
import { Backdrop, Badge, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Typography } from '@mui/material';
import { consumeItems, fetchPantryItems } from '../requests';
import { useState, useEffect, useCallback, } from 'react';
import Header from '../components/Header';


function Pantry() {
    const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
    const [pantryName, setPantryName] = useState<string>()
    const [consuming, setConsuming] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedToConsume, setSelectedToConsume] = useState<{ [id: number]: PantryItem }>({})
    const [confirmingConsumption, setConfirmingConsumption] = useState(false)
    const fetchPantry = useCallback(() => {
        const pantryId = localStorage.getItem('pantryId')
        if (pantryId === null) {
            window.location.href = '/'
        } else {
            setLoading(true)
            const fn = async () => {
                try {
                    const pantry = await fetchPantryItems(pantryId)
                    setPantryItems(pantry.items)
                    setPantryName(pantry.name)
                } catch (error) {
                    localStorage.removeItem('pantryId')
                    window.location.href = '/'
                } finally {
                    setLoading(false)
                }
            }
            fn()
        }
    }, [])

    const changeConsuming = useCallback(() => {
        setConsuming(!consuming)
    }, [consuming])

    const clearSelected = useCallback(() => {
        setConsuming(!consuming)
        setSelectedToConsume([])
    }, [consuming])

    const consume = useCallback(() => {
        const fn = async () => {
            await consumeItems(selectedToConsume)
            setConsuming(!consuming)
            setSelectedToConsume([])
            setConfirmingConsumption(false)
            fetchPantry()
        }

        fn()
    }, [consuming, selectedToConsume, fetchPantry])



    useEffect(() => {
        fetchPantry()
    }, [fetchPantry])

    return (

        <Box className="main-container">
            <Header />
            <Typography variant="h2" component="h2">{pantryName}</Typography>
            {!consuming && <div className=""><Button variant="contained" onClick={changeConsuming}> <LocalDiningIcon /> Eat</Button></div>}
            {consuming && (
                <div className="consuming-buttons">
                    <Button variant="outlined" color="error" onClick={clearSelected} > <CancelIcon /> Clear</Button>
                    <Button variant="contained" onClick={() => setConfirmingConsumption(true)}> <LocalDiningIcon /> Done</Button>

                    <Badge sx={{ display: "flex", alignItems: "center" }} color="success" badgeContent={Object.keys(selectedToConsume).length}>
                        <KitchenIcon />
                    </Badge>
                </div>
            )
            }
            {!loading && <PantryList consuming={consuming} onAddToDining={elements => setSelectedToConsume({ ...selectedToConsume, ...elements })} pantryItems={pantryItems} updateItems={() => fetchPantry()} />}

            {
                loading && <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

            <Dialog
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={confirmingConsumption}
                onClose={() => setConfirmingConsumption(false)}
            >
                <DialogTitle>Confirm Consumption</DialogTitle>
                <DialogContent>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {Object.values(selectedToConsume).map((item) => (
                            <ListItem key={item.id} >
                                {item.ingredient.name}
                            </ListItem>
                        ))}

                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmingConsumption(false)}>Cancel</Button>
                    <Button onClick={() => consume()}>Consume</Button>
                </DialogActions>
            </Dialog>
            {/* <Menu /> */}
        </Box >
    )
}

export default Pantry