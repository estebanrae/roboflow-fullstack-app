import Box from '@mui/material/Box';

import '../App.css'
import { Button, TextField, Typography } from '@mui/material';
import { useState, useCallback, useLayoutEffect } from 'react';
import { createPantry } from '../requests';
import Header from '../components/Header';

function Landing() {
    const [pantryName, setPantryName] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    useLayoutEffect(() => {
        const pantryId = localStorage.getItem('pantryId')
        if (pantryId !== null) {
            window.location.href = '/pantry/' + pantryId
        }
    }, []);

    const handleCreatePantry = useCallback(() => {
        if (!pantryName) {
            alert('Please enter a pantry name')
            return
        }

        setLoading(true)

        const fn = async () => {
            try {
                const id = await createPantry({ name: pantryName })
                localStorage.setItem('pantryId', id)
                window.location.href = `/pantry/${id}`
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                alert('Server Error. Try again later')
            } finally {
                setLoading(false)
            }
        }
        fn()

    }, [pantryName])

    return (
        <Box className="main-container">
            <Header />
            <Typography variant="h2" component="h1">Welcom to Smart Pantry!</Typography>
            <Typography variant="h3" component="h3">To get started, give your pantry a name:</Typography>
            <div className="landing-form">
                <TextField id="standard-basic" label="Name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPantryName(e.target.value)} />

                <Button loading={loading} variant="contained" color="primary" onClick={handleCreatePantry}>
                    Create Pantry
                </Button>

            </div>
        </Box >
    )
}

export default Landing
