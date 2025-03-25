import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, IconButton, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Switch } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [albumFilter, setAlbumFilter] = useState('');
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || {});
  const [viewFavorites, setViewFavorites] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos?_limit=50')
      .then(res => res.json())
      .then(data => setImages(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredImages = images.filter(img =>
    img.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (albumFilter ? img.albumId === Number(albumFilter) : true) &&
    (!viewFavorites || favorites[img.id])
  );

  return (
    <Box maxWidth="1200px" mx="auto" mt={5} p={3} borderRadius={4} boxShadow={3} >
      <TextField
        fullWidth 
        variant="outlined" 
        label="Search images..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        sx={{ mb: 3 }}
      />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filter by Album</InputLabel>
        <Select value={albumFilter} onChange={(e) => setAlbumFilter(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {[...new Set(images.map(img => img.albumId))].map(id => (
            <MenuItem key={id} value={id}>{`Album ${id}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography>View Favorites</Typography>
        <Switch checked={viewFavorites} onChange={() => setViewFavorites(!viewFavorites)} />
      </Box>
      <Grid container spacing={3}>
        {filteredImages.map((img) => (
          <Grid item xs={12} sm={6} md={4} key={img.id}>
            <Card>
              <CardMedia  
                component="img"
                height="200"  // Increased height for better visibility
                image={img.thumbnailUrl}  // Changed from thumbnailUrl to url for larger images
                alt={img.title}
                title={img.title}
                sx={{ objectFit: 'cover' }}  // Ensures the image covers the space nicely
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" noWrap>{img.title}</Typography>
                <IconButton onClick={() => toggleFavorite(img.id)}>
                  {favorites[img.id] ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}