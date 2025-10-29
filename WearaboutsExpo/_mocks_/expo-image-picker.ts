export const MediaTypeOptions = { Images: 'Images' };

export const launchImageLibraryAsync = jest.fn().mockResolvedValue({
  cancelled: false,
  assets: [{ uri: 'image1.jpg' }, { uri: 'image2.jpg' }],
});

export const launchCameraAsync = jest.fn().mockResolvedValue({ cancelled: false });
